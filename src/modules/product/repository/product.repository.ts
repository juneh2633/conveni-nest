import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { SelectProductAllDao } from '../dao/select-product-all.dao';
import { Product } from '../model/product.model';
import { RedisCacheService } from 'src/common/redis/redis.service';
import { PossibleProductIdx } from '../model/possible-product-idx.model';

@Injectable()
export class ProductRepository {
  constructor(
    private readonly prisma: PrismaService,
    private readonly redis: RedisCacheService,
  ) {}

  async selectProductAll(
    selectProductAllDao: SelectProductAllDao,
  ): Promise<Array<Product>> {
    const { categoryFilter, productIdxList } = selectProductAllDao;
    return this.prisma.product
      .findMany({
        where: {
          deletedAt: null,
          name: selectProductAllDao.keyword
            ? {
                contains: selectProductAllDao.keyword,
              }
            : undefined,
          categoryIdx:
            categoryFilter && categoryFilter.length > 0
              ? {
                  in: categoryFilter,
                }
              : undefined,
          idx:
            productIdxList && productIdxList.length > 0
              ? {
                  in: productIdxList,
                }
              : undefined,
        },
        select: {
          idx: true,
          categoryIdx: true,
          name: true,
          price: true,
          productImg: true,
          score: true,
          createdAt: true,
          bookmark: {
            select: {
              idx: true,
            },
            where: {
              accountIdx: selectProductAllDao.accountIdx,
            },
          },
        },
        orderBy: {
          name: 'asc',
        },
        skip: selectProductAllDao.offset,
        take: selectProductAllDao.limit,
      })
      ?.then((products) =>
        products.map((product) => ({
          ...product,
          bookmarked: product.bookmark.length > 0,
          bookmark: undefined,
        })),
      );
  }

  async selectProductByIdx(
    productIdx: number,
    accountIdx: number,
  ): Promise<Product> {
    return this.prisma.product.findUnique({
      where: {
        idx: productIdx,
      },
      select: {
        idx: true,
        categoryIdx: true,
        name: true,
        price: true,
        productImg: true,
        score: true,
        createdAt: true,
        bookmark: {
          select: {
            idx: true,
          },
          where: {
            accountIdx: accountIdx,
          },
        },
      },
    })[0];
  }

  async selectCachedProductIdx(
    companyIdx: number,
    option: string,
  ): Promise<Array<number>> {
    const data = await this.redis.get(
      `mainProductsAt${companyIdx}Option:${option}`,
    );
    return data ? JSON.parse(data) : [];
  }
}

//eventIdx: eventFilter[0]
//TypeError: Cannot read properties of undefined (reading '0')
