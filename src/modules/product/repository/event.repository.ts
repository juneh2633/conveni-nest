import { PrismaService } from 'src/common/prisma/prisma.service';

import { Injectable } from '@nestjs/common';
import { PossibleProductIdx } from '../model/possible-product-idx.model';
import { EventHistory } from '../model/event-history.model';
import { InsertEventDao } from '../dao/insert-event.dao';
@Injectable()
export class EventRepository {
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

  async selectEventInfo(
    possibleProductIdxArray?: Array<number>,
    month: number = 0,
  ): Promise<Array<EventHistory>> {
    return await this.prisma.eventHistory.findMany({
      select: {
        productIdx: true,
        startDate: true,
        companyIdx: true,
        eventIdx: true,
        price: true,
      },
      where: {
        productIdx: {
          in:
            possibleProductIdxArray && possibleProductIdxArray.length > 0
              ? possibleProductIdxArray
              : undefined,
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

  async insertEvent(insertEventDao: InsertEventDao): Promise<void> {
    await this.prisma.eventHistory.createMany({
      data: [
        insertEventDao.eventInfo[0]
          ? {
              startDate: new Date(),
              productIdx: insertEventDao.productIdx,
              companyIdx: insertEventDao.eventInfo[0].companyIdx,
              eventIdx: insertEventDao.eventInfo[0].eventIdx,
              price: insertEventDao.eventInfo[0].price
                ? insertEventDao.eventInfo[0].price
                : null,
            }
          : undefined,
        insertEventDao.eventInfo[1]
          ? {
              startDate: new Date(),
              productIdx: insertEventDao.productIdx,
              companyIdx: insertEventDao.eventInfo[1].companyIdx,
              eventIdx: insertEventDao.eventInfo[1].eventIdx,
              price: insertEventDao.eventInfo[1].price
                ? insertEventDao.eventInfo[1].price
                : null,
            }
          : undefined,
        insertEventDao.eventInfo[2]
          ? {
              startDate: new Date(),
              productIdx: insertEventDao.productIdx,
              companyIdx: insertEventDao.eventInfo[2].companyIdx,
              eventIdx: insertEventDao.eventInfo[2].eventIdx,
              price: insertEventDao.eventInfo[2].price
                ? insertEventDao.eventInfo[2].price
                : null,
            }
          : undefined,
      ],
    });
  }

  async deleteEvent(productIdx: number): Promise<void> {
    await this.prisma.eventHistory.deleteMany({
      where: {
        productIdx: productIdx,
      },
    });
  }
}
