import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Query,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';

import { GetUser } from 'src/common/decorator/get-user.decorator';
import { User } from '../auth/model/user.model';
import { RankGuard } from 'src/common/guard/auth.guard';
import { Rank } from 'src/common/decorator/rank.decorator';

import { GetProductsPagebleDto } from './dto/request/get-products-pageble.dto';
import { ProductFacade } from './product.facade';
import { GetProductsBySearchDto } from './dto/request/get-products-by-search.dto';
import { ProductWithAuthDto } from './dto/response/product-with-auth.dto';
import { GetProductsByCompanyDto } from './dto/request/get-products-by-company.dto';

import { FileInterceptor } from '@nestjs/platform-express';
import { multerConfig } from 'src/common/aws/config/multer.config';
import { NullResponseDto } from 'src/common/dto/null-response.dto';
import { UpsertProductDto } from './dto/request/upsert-product-dto';

@Controller('product')
export class ProductController {
  constructor(private readonly productFacade: ProductFacade) {}

  @Get('/all')
  @Rank(0)
  @UseGuards(RankGuard)
  async findProductList(
    @GetUser() user: User,
    @Query() pagerbleDto: GetProductsPagebleDto,
  ): Promise<ProductWithAuthDto> {
    const productList = await this.productFacade.findProductAll(
      user,
      pagerbleDto,
    );
    return ProductWithAuthDto.createResponse(user, productList);
  }

  @Get('/search')
  @Rank(0)
  @UseGuards(RankGuard)
  async searchProduct(
    @GetUser() user: User,
    @Query() getProductsBySearchDto: GetProductsBySearchDto,
  ): Promise<ProductWithAuthDto> {
    const productList = await this.productFacade.findProductAllBySearch(
      user,
      getProductsBySearchDto,
    );
    return ProductWithAuthDto.createResponse(user, productList);
  }

  @Get('/company/:companyIdx')
  @Rank(0)
  @UseGuards(RankGuard)
  async findProductListByCompany(
    @GetUser() user: User,
    @Query() getProductsByCompanyDto: GetProductsByCompanyDto,
    @Param() companyIdx: number,
  ): Promise<ProductWithAuthDto> {
    const productList = await this.productFacade.findProductAllByCompany(
      user,
      companyIdx,
      getProductsByCompanyDto.page,
      getProductsByCompanyDto.option,
    );
    return ProductWithAuthDto.createResponse(user, productList);
  }

  @Get('/:product')
  @Rank(0)
  @UseGuards(RankGuard)
  async findProduct(@GetUser() user: User, @Param() productIdx: number) {
    const product = await this.productFacade.findProductByIdx(productIdx, user);

    return ProductWithAuthDto.createResponse(user, product);
  }

  @Post('/')
  @Rank(2)
  @UseGuards(RankGuard)
  @UseInterceptors(FileInterceptor('image', multerConfig))
  async createProduct(
    @UploadedFile() file: Express.Multer.File,
    @Body() upsertProductDto: UpsertProductDto,
  ): Promise<NullResponseDto> {
    await this.productFacade.createProductOne(file, upsertProductDto);

    return new NullResponseDto();
  }
  @Put('/:productIdx')
  @Rank(2)
  @UseGuards(RankGuard)
  @UseInterceptors(FileInterceptor('image', multerConfig))
  async updateProduct(
    @UploadedFile() file: Express.Multer.File,
    @Body() upsertProductDto: UpsertProductDto,
    @Param() productIdx: number,
  ): Promise<NullResponseDto> {
    await this.productFacade.amendProduct(file, productIdx, upsertProductDto);

    return new NullResponseDto();
  }
}
