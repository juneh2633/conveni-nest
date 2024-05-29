import { EventHistory } from '@prisma/client';
import { ProductWithBookmark } from '../model/product-with-bookmark.model';
import { EventHistoryEntity } from './EventHistory.entity';

export class ProductWithManyEventEntity {
  idx: number;
  categoryIdx: number;
  name: string;
  price: string;
  productImg: string;
  bookmarked: boolean;
  score: string;
  createdAt: Date;
  eventInfo: EventHistoryEntity;

  constructor(data) {
    Object.assign(this, data);
  }

  public static create(
    product: ProductWithBookmark,
    eventList: EventHistory[],
  ): ProductWithManyEventEntity {
    const currentDate = new Date();

    const pastDate = new Date();
    pastDate.setMonth(currentDate.getMonth() - 10);

    const recentEvents = eventList.filter(
      (event) => event.startDate >= pastDate,
    );

    const eventMap: { [key: string]: Array<EventHistory> } = {};

    recentEvents.forEach((event) => {
      const monthKey = `${event.startDate.getFullYear()}-${String(event.startDate.getMonth() + 1).padStart(2, '0')}`;

      if (!eventMap[monthKey]) {
        eventMap[monthKey] = [];
      }

      eventMap[monthKey].push(event);
    });
    const eventInfo = [];
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth() + 1;

    for (let i = 0; i < 11; i++) {
      const targetDate = new Date();
      targetDate.setMonth(currentMonth - 1 - i);
      const targetYear = targetDate.getFullYear();
      const targetMonth = String(targetDate.getMonth() + 1).padStart(2, '0');
      const monthKey = `${targetYear}-${targetMonth}`;

      eventInfo.push({
        month: `${targetYear}-${targetMonth}`,
        events: eventMap[monthKey]
          ? eventMap[monthKey].map((evt) => ({
              companyIdx: evt.companyIdx,
              eventIdx: evt.eventIdx,
              price: evt.price,
            }))
          : null,
      });
    }
    return new ProductWithManyEventEntity({
      idx: product.idx,
      categoryIdx: product.categoryIdx,
      name: product.name,
      price: product.price,
      productImg: product.productImg,
      bookmarked: product.bookmarked,
      createdAt: product.createdAt,
      eventInfo: eventInfo,
    });
  }
}
