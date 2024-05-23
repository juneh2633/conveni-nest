import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ProductService } from './product.service';
import { GetUser } from 'src/common/decorator/get-user.decorator';
import { User } from '../auth/model/user.model';
import { RankGuard } from 'src/common/guard/auth.guard';
import { Rank } from 'src/common/decorator/rank.decorator';
import { ProductManyDto } from './dto/response/product-many.dto';
import { GetProductsPagebleDto } from './dto/request/get-products-pageble.dto';

@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get('/all')
  @Rank(0)
  @UseGuards(RankGuard)
  async findProductList(
    @GetUser() user: User,
    @Query() pagerbleDto: GetProductsPagebleDto,
  ): Promise<ProductManyDto> {
    const productWithEventDto = await this.productService.getProductAll(
      pagerbleDto.page,
    );
    return ProductManyDto.createResponse(user, productWithEventDto);
  }
}
