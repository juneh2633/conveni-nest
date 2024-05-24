import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { PossibleProductIdx } from './model/possible-product-idx.model';
import { SelectProductAllDao } from './dao/select-product-all.dao';
import { Product } from './model/product.model';

@Injectable()
export class ProductRepository {
  constructor(private readonly prisma: PrismaService) {}

  async selectPossibleProductIdxByEventFilter(
    eventFilter: Array<number>,
  ): Promise<Array<PossibleProductIdx>> {
    return this.prisma.eventHistory.findMany({
      select: {
        idx: true,
      },
      where: {
        eventIdx:
          eventFilter && eventFilter.length > 0
            ? {
                in: eventFilter,
              }
            : undefined,
        startDate: {
          gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
          lt: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0),
        },
      },
      distinct: ['productIdx'],
    });
  }

  async selectProductAll(
    selectProductAllDao: SelectProductAllDao,
  ): Promise<Array<Product>> {
    const { categoryFilter } = selectProductAllDao;
    return this.prisma.product.findMany({
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
        idx: {
          in: selectProductAllDao.productIdxList,
        },
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
        },
      },
      orderBy: {
        name: 'asc',
      },
      skip: selectProductAllDao.offset,
      take: selectProductAllDao.limit,
    });
  }
}

//eventIdx: eventFilter[0]
//TypeError: Cannot read properties of undefined (reading '0')
