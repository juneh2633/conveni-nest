import { EventHistory } from '@prisma/client';
import { ProductWithBookmark } from '../model/product-with-bookmark.model';
import { EventHistoryEntity } from './EventHistory.entity';

export class ProductWithEventEntity {
  idx: number;
  categoryIdx: number;
  name: string;
  price: string;
  productImg: string;
  bookmarked: boolean;
  score: string;
  createdAt: Date;
  events: EventHistoryEntity[];
  constructor(data) {
    Object.assign(this, data);
  }

  public static create(
    productList: ProductWithBookmark[],
    eventList: EventHistory[],
  ): ProductWithEventEntity[] {
    const eventMap = eventList.reduce((acc, event) => {
      if (!acc[event?.productIdx]) {
        acc[event?.productIdx] = [];
      }
      acc[event.productIdx].push({
        companyIdx: event?.companyIdx,
        eventIdx: event?.eventIdx,
        price: event?.price,
      });
      return acc;
    }, {});

    return productList.map((product) => {
      return new ProductWithEventEntity({
        idx: product.idx,
        categoryIdx: product.categoryIdx,
        name: product.name,
        price: product.price,
        productImg: product.productImg,
        bookmarked: product.bookmarked,
        createdAt: product.createdAt,
        events: eventMap[product.idx] || [],
      });
    });
  }
}
