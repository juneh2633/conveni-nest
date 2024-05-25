import { Injectable } from '@nestjs/common';
import { EventService } from './service/event.service';
import { ProductService } from './service/product.service';
import { GetProductsPagebleDto } from './dto/request/get-products-pageble.dto';
import { User } from '../auth/model/user.model';
import { Product } from './model/product.model';
import { EventHistory } from './model/event-history.model';
import { ProductWithEvent } from './model/product-with-event.model';
import { GetProductsBySearchDto } from './dto/request/get-products-by-search.dto';
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
    console.log(getProductsBySearchDto.categoryFilter);
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

  productWrapper(
    productList: Array<Product>,
    eventList: Array<EventHistory>,
  ): Array<ProductWithEvent> {
    const eventMap = eventList.reduce((acc, event) => {
      if (!acc[event.productIdx]) {
        acc[event.productIdx] = [];
      }
      acc[event.productIdx].push({
        companyIdx: event.companyIdx,
        eventIdx: event.eventIdx,
        price: event.price,
      });
      return acc;
    }, {});

    return productList.map((product) => ({
      ...product,
      events: eventMap[product.idx] || [],
    }));
  }
}
