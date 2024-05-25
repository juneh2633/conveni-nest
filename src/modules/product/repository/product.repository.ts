import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { SelectProductAllDao } from '../dao/select-product-all.dao';
import { Product } from '../model/product.model';

@Injectable()
export class ProductRepository {
  constructor(private readonly prisma: PrismaService) {}

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
}

//eventIdx: eventFilter[0]
//TypeError: Cannot read properties of undefined (reading '0')
