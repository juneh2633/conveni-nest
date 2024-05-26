import { Injectable } from '@nestjs/common';
import { EventService } from './service/event.service';
import { ProductService } from './service/product.service';
import { GetProductsPagebleDto } from './dto/request/get-products-pageble.dto';
import { User } from '../auth/model/user.model';
import { Product } from './model/product.model';
import { EventHistory } from './model/event-history.model';
import { ProductWithEvent } from './model/product-with-event.model';
import { GetProductsBySearchDto } from './dto/request/get-products-by-search.dto';
import { PossibleProductIdx } from './model/possible-product-idx.model';
import { ProductWithManyEvent } from './model/product-with-many-event.model';
@Injectable()
export class ProductFacade {
  constructor(
    private readonly productService: ProductService,
    private readonly eventService: EventService,
  ) {}

  async productAll(
    user: User,
    pagerbleDto: GetProductsPagebleDto,
  ): Promise<Array<ProductWithEvent>> {
    const [productList, eventList] = await Promise.all([
      this.productService.getProductMany(pagerbleDto.page, user.idx),
      this.eventService.getEventList(),
    ]);

    return this.productWrapper(productList, eventList);
  }

  async productAllBySearch(
    user: User,
    getProductsBySearchDto: GetProductsBySearchDto,
  ): Promise<Array<ProductWithEvent>> {
    const filter = {
      keyword: getProductsBySearchDto.keyword,
      categoryFilter: getProductsBySearchDto.categoryFilter,
      page: getProductsBySearchDto.page,
    };

    const possibleProductIdx =
      await this.productService.getPossibleProductByEvent(
        getProductsBySearchDto.eventFilter,
      );

    const [productList, eventList] = await Promise.all([
      this.productService.getProductMany(
        getProductsBySearchDto.page,
        user.idx,
        possibleProductIdx,
        filter,
      ),
      this.eventService.getEventList(possibleProductIdx),
    ]);

    return this.productWrapper(productList, eventList);
  }

  async productByIdx(productIdx: number, user: User) {
    const [product, event] = await Promise.all([
      this.productService.getProductByIdx(productIdx, user),
      this.eventService.getEventList([{ idx: productIdx }], 9),
    ]);
    return this.productWithManyEventWrapper(product, event);
  }

  productWrapper(
    productList: Array<Product>,
    eventList: Array<EventHistory>,
  ): Array<ProductWithEvent> {
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

    return productList.map((product) => ({
      ...product,
      events: eventMap[product.idx] || [],
    }));
  }

  productWithManyEventWrapper(
    product: Product,
    eventList: Array<EventHistory>,
  ): ProductWithManyEvent {
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
    const eventInfo = Object.keys(eventMap).map((monthKey) => {
      return {
        month: new Date(monthKey + '-01'), // 'YYYY-MM' 형식을 Date 객체로 변환
        events: eventMap[monthKey].map((evt) => ({
          companyIdx: evt.companyIdx,
          eventIdx: evt.eventIdx,
          price: evt.price,
        })),
      };
    });

    return {
      product: product,
      eventInfo: eventInfo,
    };
  }
}
