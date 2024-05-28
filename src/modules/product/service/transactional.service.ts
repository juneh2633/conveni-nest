import { ProductRepository } from '../repository/product.repository';

import { Prisma } from '@prisma/client';

export class TransactionalService {
  constructor(private readonly productRepository: ProductRepository) {}

  async inputProduct(
    categoryIdx: number,
    price: number,
    name: string,
    prisma: Prisma.TransactionClient,
    productImg: string = 'noImg',
  ): Promise<number> {
    return await prisma.product.create({
      data: {
        categoryIdx: categoryIdx,
        price: price.toString(),
        name: name,
        productImg: productImg,
      },
      select: {
        idx: true,
      },
    })[0].idx;
  }

  async inputEvent(
    productIdx: number,
    companyIdx: number,
    eventIdx: number,
    eventPrice: number | null,
    prisma: Prisma.TransactionClient,
  ): Promise<void> {
    await prisma.eventHistory.create({
      data: {
        startDate: new Date(),
        productIdx: productIdx,
        companyIdx: companyIdx,
        eventIdx: eventIdx,
        price: !eventPrice ? null : eventPrice.toString(),
      },
    });
  }
  async deleteEvent(
    productIdx: number,
    prisma: Prisma.TransactionClient,
  ): Promise<void> {
    await prisma.eventHistory.deleteMany({
      where: {
        productIdx: productIdx,
        startDate: {
          gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
          lt: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0),
        },
      },
    });
  }

  async updateProduct(
    productIdx: number,
    categoryIdx: number,
    price: number,
    name: string,
    prisma: Prisma.TransactionClient,
    productImg?: string,
  ): Promise<void> {
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
}
