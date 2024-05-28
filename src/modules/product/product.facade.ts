import { Injectable } from '@nestjs/common';
import { EventService } from './service/event.service';
import { ProductService } from './service/product.service';
import { GetProductsPagebleDto } from './dto/request/get-products-pageble.dto';
import { User } from '../auth/model/user.model';
import { Product } from './model/product.model';
import { EventHistory } from './model/event-history.model';
import { ProductWithEvent } from './model/product-with-event.model';
import { GetProductsBySearchDto } from './dto/request/get-products-by-search.dto';

import { ProductWithManyEvent } from './model/product-with-many-event.model';
import { AwsService } from 'src/common/aws/aws.service';
import { CreateProductDto } from './dto/request/create-product-dto';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { TransactionalService } from './service/transactional.service';
@Injectable()
export class ProductFacade {
  constructor(
    private readonly productService: ProductService,
    private readonly transactionalService: TransactionalService,
    private readonly eventService: EventService,
    private readonly awsService: AwsService,
    private readonly prismaService: PrismaService,
  ) {}

  async findProductAll(
    user: User,
    pagerbleDto: GetProductsPagebleDto,
  ): Promise<Array<ProductWithEvent>> {
    const [productList, eventList] = await Promise.all([
      this.productService.getProductMany(pagerbleDto.page, user.idx),
      this.eventService.getEventList(),
    ]);

    return this.productWrapper(productList, eventList);
  }

  async findProductAllBySearch(
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

  async findProductAllByCompany(
    user: User,
    companyIdx: number,
    page: number,
    option: string,
  ) {
    const possibleProductIdxList =
      await this.productService.getCachedMainProductIdxList(companyIdx, option);

    const [productList, eventList] = await Promise.all([
      this.productService.getProductMany(
        page,
        user.idx,
        possibleProductIdxList,
      ),
      this.eventService.getEventList(possibleProductIdxList),
    ]);

    return this.productWrapper(productList, eventList);
  }

  async findProductByIdx(productIdx: number, user: User) {
    const [product, event] = await Promise.all([
      this.productService.getProductByIdx(productIdx, user),
      this.eventService.getEventList([{ idx: productIdx }], 9),
    ]);
    return this.productWithManyEventWrapper(product, event);
  }

  async createProductOne(
    file: Express.Multer.File,
    createProductDto: CreateProductDto,
  ): Promise<void> {
    return this.prismaService.$transaction(async (prisma) => {
      const url = await this.awsService.uploadImage(file);
      const { eventInfo } = createProductDto;
      const productIdx = await this.transactionalService.inputProduct(
        createProductDto.categoryIdx,
        createProductDto.price,
        createProductDto.name,
        prisma,
        url,
      );
      const eventPromises = eventInfo.map((obj) =>
        this.transactionalService.inputEvent(
          productIdx,
          obj.companyIdx,
          obj.eventIdx,
          obj.eventPrice,
          prisma,
        ),
      );

      await Promise.all(eventPromises);
    });
  }

  // method
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
        month: new Date(monthKey + '-01'),
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
