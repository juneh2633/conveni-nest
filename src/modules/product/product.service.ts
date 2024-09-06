import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { EventRepository } from './repository/event.repository';
import { ProductRepository } from './repository/product.repository';
import { GetProductsPagebleDto } from './dto/request/get-products-pageble.dto';
import { User } from '../auth/model/user.model';

import { GetProductsBySearchDto } from './dto/request/get-products-by-search.dto';

import { AwsService } from 'src/common/aws/aws.service';
import { UpsertProductDto } from './dto/request/upsert-product-dto';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { ProductWithEventEntity } from './entity/ProductWithEvent.entity';
import { ProductWithManyEventEntity } from './entity/productWithManyEvent.entity';
import { BookmarkRepository } from '../bookmark/bookmark.repository';

@Injectable()
export class ProductService {
  constructor(
    private readonly productRepository: ProductRepository,
    private readonly bookmarkRepository: BookmarkRepository,
    private readonly eventRepository: EventRepository,
    private readonly awsService: AwsService,
    private readonly prismaService: PrismaService,
  ) {}

  async findProductAll(
    user: User,
    page: number,
  ): Promise<ProductWithEventEntity[]> {
    const [productList, eventList] = await Promise.all([
      this.productRepository.selectProductMany(page, user.idx),
      this.eventRepository.getEventList(),
    ]);

    return ProductWithEventEntity.createMany(productList, eventList);
  }

  async findProductAllBySearch(
    user: User,
    getProductsBySearchDto: GetProductsBySearchDto,
  ): Promise<ProductWithEventEntity[]> {
    const filter = {
      keyword: getProductsBySearchDto.keyword,
      categoryFilter: getProductsBySearchDto.categoryFilter,
      page: getProductsBySearchDto.page,
    };

    const possibleProductIdx =
      await this.eventRepository.getProductIdxByEventFilter(
        getProductsBySearchDto.eventFilter,
      );
    if (!possibleProductIdx) {
      throw new BadRequestException('no product');
    }
    const productIdxList = possibleProductIdx.map((obj) => obj.productIdx);
    const [productList, eventList] = await Promise.all([
      this.productRepository.selectProductMany(
        getProductsBySearchDto.page,
        user.idx,
        productIdxList,
        filter,
      ),
      this.eventRepository.getEventList(productIdxList),
    ]);

    return ProductWithEventEntity.createMany(productList, eventList);
  }

  async findProductAllByCompany(
    user: User,
    companyIdx: number,
    page: number,
    option: string,
  ): Promise<ProductWithEventEntity[]> {
    const possibleProductIdxList =
      await this.productRepository.selectCachedMainProductIdxList(
        companyIdx,
        option,
      );
    const productIdxList = possibleProductIdxList.map((obj) => obj.idx);
    const [productList, eventList] = await Promise.all([
      this.productRepository.selectProductMany(page, user.idx, productIdxList),
      this.eventRepository.getEventList(productIdxList),
    ]);

    return ProductWithEventEntity.createMany(productList, eventList);
  }

  async findProductAllByBookmark(user: User, page: number) {
    const possibleProductIdxList =
      await this.bookmarkRepository.selectBookmarkAll(user.idx);
    const productIdxList = possibleProductIdxList.map((obj) => obj.idx);
    const [productList, eventList] = await Promise.all([
      this.productRepository.selectProductMany(page, user.idx, productIdxList),
      this.eventRepository.getEventList(productIdxList),
    ]);

    return ProductWithEventEntity.createMany(productList, eventList);
  }
  async findProductByIdx(
    productIdx: number,
    user: User,
  ): Promise<ProductWithManyEventEntity> {
    const [product, event] = await Promise.all([
      this.productRepository.selectProductByIdx(productIdx, user.idx),
      this.eventRepository.getEventList([productIdx], 9),
    ]);

    if (!product) {
      throw new NotFoundException('no product');
    }
    return ProductWithManyEventEntity.create(product, event);
  }

  async createProductOne(
    file: Express.Multer.File,
    upsertProductDto: UpsertProductDto,
  ): Promise<void> {
    await this.prismaService.$transaction(async (prisma) => {
      const url = await this.awsService.uploadImage(file);
      const { eventInfo } = upsertProductDto;
      const productIdx = await this.productRepository.insertProduct(
        upsertProductDto.categoryIdx,
        upsertProductDto.price,
        upsertProductDto.name,
        url,
        prisma,
      );
      const eventPromises = eventInfo.map((obj) =>
        this.eventRepository.insertEvent(
          productIdx,
          obj.companyIdx,
          obj.eventIdx,
          obj.eventPrice,
          prisma,
        ),
      );
      await this.cacheMainProduct(1);
      await this.cacheMainProduct(2);
      await this.cacheMainProduct(3);
      await Promise.all(eventPromises);
    });
  }

  async amendProduct(
    file: Express.Multer.File,
    productIdx: number,
    upsertProductDto: UpsertProductDto,
  ): Promise<void> {
    await this.prismaService.$transaction(async (prisma) => {
      const url = await this.awsService.uploadImage(file);
      const { eventInfo } = upsertProductDto;
      await this.eventRepository.deleteEvent(productIdx, prisma);

      const updateProduct = this.productRepository.updateProduct(
        productIdx,
        upsertProductDto.categoryIdx,
        upsertProductDto.price,
        upsertProductDto.name,
        url,
        prisma,
      );
      const eventPromises = eventInfo.map((obj) =>
        this.eventRepository.insertEvent(
          productIdx,
          obj.companyIdx,
          obj.eventIdx,
          obj.eventPrice,
          prisma,
        ),
      );
      await this.cacheMainProduct(1);
      await this.cacheMainProduct(2);
      await this.cacheMainProduct(3);
      await Promise.all([...eventPromises, updateProduct]);
    });
  }

  async removeProduct(productIdx: number): Promise<void> {
    await this.productRepository.deleteProduct(productIdx);
    await this.cacheMainProduct(1);
    await this.cacheMainProduct(2);
    await this.cacheMainProduct(3);
  }

  async cacheMainProduct(companyIdx: number): Promise<void> {
    const productCount =
      await this.productRepository.selectProductsCountByCompany(companyIdx);
  }
}
