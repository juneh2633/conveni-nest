import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { PossibleProductIdx } from './model/possible-product-idx.model';
import { SelectProductAllDao } from './dao/select-product-all.dao';
import { Product } from './model/product.model';
import { User } from '../auth/model/user.model';

@Injectable()
export class ProductRepository {
  constructor(private readonly prisma: PrismaService) {}

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

  select;
}

//eventIdx: eventFilter[0]
//TypeError: Cannot read properties of undefined (reading '0')
