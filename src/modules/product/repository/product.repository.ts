import { Injectable } from '@nestjs/common';

import { RedisCacheService } from 'src/common/redis/redis.service';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { Account, Prisma, Product } from '@prisma/client';
import { ProductWithBookmark } from '../model/product-with-bookmark.model';

interface Filter {
  keyword?: string;
  categoryFilter?: Array<number>;
  page?: number;
}

@Injectable()
export class ProductRepository {
  constructor(
    private readonly redis: RedisCacheService,
    private readonly prismaService: PrismaService,
  ) {}

  async selectProductMany(
    page: number,
    accountIdx: number,
    productIdxList?: number[],
    filter: Filter = {},
    limit: number = 10,
  ): Promise<ProductWithBookmark[]> {
    const products = await this.prismaService.product.findMany({
      where: {
        deletedAt: null,
        name: filter.keyword
          ? {
              contains: filter.keyword,
            }
          : undefined,
        categoryIdx: filter.categoryFilter?.[0]
          ? {
              in: filter.categoryFilter,
            }
          : undefined,

        // 배열에 인자가 있는 경우
        idx: productIdxList?.[0]
          ? {
              in: productIdxList,
            }
          : undefined,
      },
      include: {
        bookmark: {
          where: {
            accountIdx: accountIdx,
          },
        },
      },
      orderBy: {
        name: 'asc',
      },
      skip: (page - 1) * 10,
      take: limit,
    });

    return products.map((product) => ({
      ...product,
      bookmarked: product.bookmark?.[0] ? true : false,
      bookmark: undefined,
    }));
  }

  async selectProductByIdx(
    productIdx: number,
    accountIdx: number,
  ): Promise<ProductWithBookmark> {
    const product = await this.prismaService.product.findUnique({
      where: {
        idx: productIdx,
        deletedAt: null,
      },
      include: {
        bookmark: {
          where: {
            accountIdx: accountIdx,
          },
        },
      },
    });
    if (!product) {
      return undefined;
    }
    return {
      idx: product.idx,
      categoryIdx: product.categoryIdx,
      name: product.name,
      price: product.price,
      productImg: product.productImg,
      deletedAt: product.deletedAt,
      score: product.score,
      createdAt: product.createdAt,
      bookmarked: product.bookmark?.[0] ? true : false,
    };
  }

  async selectCachedMainProductIdxList(
    companyIdx: number,
    option: string,
  ): Promise<Pick<Product, 'idx'>[]> {
    const data = await this.redis.get(
      `mainProductsAt${companyIdx}Option:${option}`,
    );
    const productArray: Array<number> = data ? JSON.parse(data) : [];

    return productArray.map((idx) => {
      return { idx: idx };
    });
  }
  async selectProductByCompany() {}
  async selectProductsCountByCompany(companyIdx: number): Promise<number> {
    const queryResult = await this.prismaService.$queryRaw`
                WITH productInfo AS (
                SELECT
                    product.idx,
                    ARRAY (
                        SELECT
                            json_build_object(
                                'companyIdx', event_history.company_idx,
                                'eventType', event_history.event_idx,
                                'price', price
                            )
                        FROM
                            event_history
                        WHERE
                            event_history.product_idx = product.idx
                        AND
                            event_history.start_date >= date_trunc('month', current_date)
                        AND
                            event_history.start_date < date_trunc('month', current_date) + interval '1 month'
                        ORDER BY
                            event_history.company_idx
                    ) AS eventInfo,
                    (
                        SELECT
                            SUM(
                                CASE
                                    WHEN event_history.company_idx = ${companyIdx} THEN event.priority * 2
                                    ELSE -event.priority
                                END
                            )
                        FROM
                            event_history
                        JOIN 
                            event ON event_history.event_idx = event.idx
                        WHERE          
                            event_history.product_idx = product.idx 
                        AND
                            event_history.start_date >= date_trunc('month', current_date)
                        AND
                            event_history.start_date < date_trunc('month', current_date) + interval '1 month'
                        GROUP BY
                            event_history.product_idx
                    ) AS priorityScore
                FROM    
                    product
                WHERE
                    product.deleted_at IS NULL
            )
            SELECT 
                COUNT(*)
            FROM 
                productInfo
            WHERE priorityScore >= 0;
    `;
    return queryResult[0].count;
  }
  async insertProduct(
    categoryIdx: number,
    price: number,
    name: string,
    productImg: string = 'noImg',
    prismaTx: Prisma.TransactionClient,
  ): Promise<number> {
    const prisma = prismaTx ? prismaTx : this.prismaService;
    const query = await prisma.product.create({
      data: {
        categoryIdx: categoryIdx,
        price: price.toString(),
        name: name,
        productImg: productImg,
      },
      select: {
        idx: true,
      },
    });
    return query.idx;
  }

  async updateProduct(
    productIdx: number,
    categoryIdx: number,
    price: number,
    name: string,
    productImg?: string,
    prismaTx?: Prisma.TransactionClient,
  ): Promise<void> {
    const prisma = prismaTx ? prismaTx : this.prismaService;

    const updateData: any = {
      categoryIdx: categoryIdx,
      price: price.toString(),
      name: name,
    };

    if (productImg) {
      updateData.productImg = productImg;
    }
    await prisma.product.update({
      where: {
        idx: productIdx,
      },
      data: updateData,
    });
  }

  async deleteProduct(
    productIdx: number,
    prismaTx?: Prisma.TransactionClient,
  ): Promise<void> {
    const prisma = prismaTx ? prismaTx : this.prismaService;
    await prisma.product.update({
      where: {
        idx: productIdx,
      },
      data: {
        deletedAt: new Date(),
      },
    });
  }
}
