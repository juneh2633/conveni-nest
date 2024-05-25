import { Controller, Get, Query, UseGuards } from '@nestjs/common';

import { GetUser } from 'src/common/decorator/get-user.decorator';
import { User } from '../auth/model/user.model';
import { RankGuard } from 'src/common/guard/auth.guard';
import { Rank } from 'src/common/decorator/rank.decorator';
import { ProductManyDto } from './dto/response/product-many.dto';
import { GetProductsPagebleDto } from './dto/request/get-products-pageble.dto';
import { ProductFacade } from './product.facade';

@Controller('product')
export class ProductController {
  constructor(private readonly productFacade: ProductFacade) {}

  @Get('/all')
  @Rank(0)
  @UseGuards(RankGuard)
  async findProductList(
    @GetUser() user: User,
    @Query() pagerbleDto: GetProductsPagebleDto,
  ): Promise<ProductManyDto> {
    const productList = await this.productFacade.productAll(user, pagerbleDto);
    return ProductManyDto.createResponse(user, productList);
  }
}
