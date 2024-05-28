import { Injectable } from '@nestjs/common';

import { Product } from '../model/product.model';
import { ProductRepository } from '../repository/product.repository';
import { EventRepository } from '../repository/event.repository';
import { User } from 'src/modules/auth/model/user.model';
import { Idx } from '../model/possible-product-idx.model';

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
  ): Promise<Array<Idx>> {
    return await this.eventRepository.selectPossibleProductIdxByEventFilter(
      eventFilter,
    );
  }

  async getProductMany(
    page: number,
    accountIdx: number,
    possibleProductList?: Array<Idx>,
    filter: Filter = {},
    limit: number = 10,
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

  async getProductByIdx(productIdx: number, user: User): Promise<Product> {
    return await this.productRepository.selectProductByIdx(
      productIdx,
      user.idx,
    );
  }

  async getCachedMainProductIdxList(
    companyIdx: number,
    option: string,
  ): Promise<Array<Idx>> {
    const productArray = await this.productRepository.selectCachedProductIdx(
      companyIdx,
      option,
    );
    return productArray.map((idx) => {
      return { idx: idx };
    });
  }
}
