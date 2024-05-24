import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { RedisCacheService } from 'src/common/redis/redis.service';
import { User } from '../auth/model/user.model';
import { ProductRepository } from './product.repository';
import { EventRepository } from './event.repository';
import { BookmarkRepository } from '../bookmark/bookmark.repository';
import { ProductWithEventHistoryDto } from './dto/product-with-event-history.dto';

interface Filter {
  keyword?: string;
  categoryFilter?: Array<number>;
  eventFilter?: Array<number>;
  page?: number;
}

@Injectable()
export class ProductService {
  constructor(
    private readonly productRepository: ProductRepository,
    private readonly eventRepository: EventRepository,
  ) {}
  async getProductAll(
    page: number,
    limit: number = 10,
    filter: Filter = {},
  ): Promise<ProductWithEventHistoryDto> {
    const possibleProductList =
      await this.productRepository.selectPossibleProductIdxByEventFilter(
        filter.eventFilter,
      );

    const [productList, eventInfoList] = await Promise.all([
      await this.productRepository.selectProductAll({
        keyword: filter.keyword,
        categoryFilter: filter.categoryFilter,
        productIdxList: possibleProductList.map((event) => event.idx),
        offset: (page - 1) * 10,
        limit: limit,
      }),
      await this.eventRepository.selectEventInfo(possibleProductList),
    ]);

    return {
      productList: productList,
      eventList: eventInfoList,
    };
  }
}
