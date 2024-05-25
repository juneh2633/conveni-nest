import { Injectable } from '@nestjs/common';

import { PossibleProductIdx } from '../model/possible-product-idx.model';
import { Product } from '../model/product.model';
import { ProductRepository } from '../repository/product.repository';
import { EventRepository } from '../repository/event.repository';

interface Filter {
  keyword?: string;
  categoryFilter?: Array<number>;
  page?: number;
}

@Injectable()
export class ProductService {
  constructor(
    private readonly productRepository: ProductRepository,
    private readonly eventRepository: EventRepository,
  ) {}

  async getPossibleProductByEvent(
    eventFilter: Array<number>,
  ): Promise<Array<PossibleProductIdx>> {
    return await this.eventRepository.selectPossibleProductIdxByEventFilter(
      eventFilter,
    );
  }

  async getProductMany(
    page: number,
    accountIdx: number,
    possibleProductList?: Array<PossibleProductIdx>,
    limit: number = 10,
    filter: Filter = {},
  ): Promise<Array<Product>> {
    return await this.productRepository.selectProductAll({
      keyword: filter.keyword,
      categoryFilter: filter.categoryFilter,
      productIdxList: possibleProductList?.map((item) => item.idx),
      offset: (page - 1) * 10,
      limit: limit,
      accountIdx: accountIdx,
    });
  }
}
//eventIdx: eventFilter[0]
//TypeError: Cannot read properties of undefined (reading '0')
