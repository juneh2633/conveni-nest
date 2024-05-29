import { Injectable } from '@nestjs/common';

import { RedisCacheService } from 'src/common/redis/redis.service';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { EventHistory, Prisma } from '@prisma/client';

@Injectable()
export class EventRepository {
  constructor(
    //private readonly redis: RedisCacheService,
    private readonly prismaService: PrismaService,
  ) {}

  async getProductIdxByEventFilter(
    eventFilter: number[],
  ): Promise<Pick<EventHistory, 'productIdx'>[]> {
    return this.prismaService.eventHistory.findMany({
      select: {
        productIdx: true,
      },
      where: {
        eventIdx: eventFilter?.[0]
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

  async getEventList(
    productList?: number[],
    month: number = 0,
  ): Promise<EventHistory[]> {
    return await this.prismaService.eventHistory.findMany({
      where: {
        productIdx: {
          in: productList?.[0] ? productList : undefined,
        },
        startDate: {
          gte: new Date(
            new Date().getFullYear(),
            new Date().getMonth() - month,
            1,
          ),
          lte: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0),
        },
      },
    });
  }

  async insertEvent(
    productIdx: number,
    companyIdx: number,
    eventIdx: number,
    eventPrice: number | null,
    prismaTx: Prisma.TransactionClient,
  ): Promise<void> {
    const prisma = prismaTx ? prismaTx : this.prismaService;
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
    prismaTx: Prisma.TransactionClient,
  ): Promise<void> {
    const prisma = prismaTx ? prismaTx : this.prismaService;
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
}
