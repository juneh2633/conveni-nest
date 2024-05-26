import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';

import { GetUser } from 'src/common/decorator/get-user.decorator';
import { User } from '../auth/model/user.model';
import { RankGuard } from 'src/common/guard/auth.guard';
import { Rank } from 'src/common/decorator/rank.decorator';

import { GetProductsPagebleDto } from './dto/request/get-products-pageble.dto';
import { ProductFacade } from './product.facade';
import { GetProductsBySearchDto } from './dto/request/get-products-by-search.dto';
import { ProductWithAuthDto } from './dto/response/product-with-auth.dto';

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
    const productList = await this.productFacade.productAll(user, pagerbleDto);
    return ProductWithAuthDto.createResponse(user, productList);
  }

  @Get('/search')
  @Rank(0)
  @UseGuards(RankGuard)
  async searchProduct(
    @GetUser() user: User,
    @Query() getProductsBySearchDto: GetProductsBySearchDto,
  ): Promise<ProductWithAuthDto> {
    const productList = await this.productFacade.productAllBySearch(
      user,
      getProductsBySearchDto,
    );
    return ProductWithAuthDto.createResponse(user, productList);
  }

  @Get('/:product')
  @Rank(0)
  @UseGuards(RankGuard)
  async findProduct(@GetUser() user: User, @Param() productIdx: number) {
    const product = await this.productFacade.productByIdx(productIdx, user);

    return ProductWithAuthDto.createResponse(user, product);
  }
}
