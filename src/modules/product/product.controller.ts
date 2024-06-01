import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseFilePipe,
  ParseIntPipe,
  Post,
  Put,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { GetUser } from 'src/common/decorator/get-user.decorator';
import { User } from '../auth/model/user.model';
import { GetProductsPagebleDto } from './dto/request/get-products-pageble.dto';
import { GetProductsBySearchDto } from './dto/request/get-products-by-search.dto';
import { ProductWithAuthDto } from './dto/response/product-with-auth.dto';
import { GetProductsByCompanyDto } from './dto/request/get-products-by-company.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { multerConfigProvider } from 'src/common/aws/config/multer.config';
import { NullResponseDto } from 'src/common/dto/null-response.dto';
import { UpsertProductDto } from './dto/request/upsert-product-dto';
import { ProductService } from './product.service';
import { AuthCheck } from 'src/common/decorator/auth-check.decorator';
import { ApiConsumes, ApiQuery, ApiTags } from '@nestjs/swagger';
import { ApiException } from 'src/common/decorator/api-exception.decorator';

@ApiTags('Product API')
@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  /**
   * 상품 전체 가져오기
   */
  @Get('/all')
  @AuthCheck(0)
  async findProductList(
    @GetUser() user: User,
    @Query() pagerbleDto: GetProductsPagebleDto,
  ): Promise<ProductWithAuthDto> {
    const productList = await this.productService.findProductAll(
      user,
      pagerbleDto.page,
    );
    return ProductWithAuthDto.createResponse(user, productList);
  }

  /**
   * 상품 검색하기
   */
  @Get('/search')
  @AuthCheck(0)
  async searchProduct(
    @GetUser() user: User,
    @Query() getProductsBySearchDto: GetProductsBySearchDto,
  ): Promise<ProductWithAuthDto> {
    const productList = await this.productService.findProductAllBySearch(
      user,
      getProductsBySearchDto,
    );
    return ProductWithAuthDto.createResponse(user, productList);
  }

  /**
   * 회사별 상품 가져오기
   */
  @Get('/company/:companyIdx')
  @AuthCheck(0)
  async findProductListByCompany(
    @GetUser() user: User,
    @Query() getProductsByCompanyDto: GetProductsByCompanyDto,
    @Param('companyIdx', ParseIntPipe) companyIdx: number,
  ): Promise<ProductWithAuthDto> {
    const productList = await this.productService.findProductAllByCompany(
      user,
      companyIdx,
      getProductsByCompanyDto.page,
      getProductsByCompanyDto.option,
    );
    return ProductWithAuthDto.createResponse(user, productList);
  }
  @Get('/bookmark')
  @AuthCheck(1)
  async findProductListByBookmark(
    @GetUser() user: User,
    @Query() getProductsPagebleDto: GetProductsPagebleDto,
  ): Promise<ProductWithAuthDto> {
    const productList = await this.productService.findProductAllByBookmark(
      user,
      getProductsPagebleDto.page,
    );
    return ProductWithAuthDto.createResponse(user, productList);
  }
  /**
   * 상품 상세보기
   */
  @Get('/:productIdx')
  @AuthCheck(0)
  async findProduct(
    @GetUser() user: User,
    @Param('productIdx', ParseIntPipe) productIdx: number,
  ) {
    const product = await this.productService.findProductByIdx(
      productIdx,
      user,
    );

    return ProductWithAuthDto.createResponse(user, product);
  }

  /**
   *  상품 추가
   */
  @Post('/')
  @AuthCheck(2)
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('image', multerConfigProvider('img')))
  async createProduct(
    @Body() upsertProductDto: UpsertProductDto,
    @UploadedFile('file', ParseFilePipe) file?: Express.Multer.File,
  ): Promise<NullResponseDto> {
    if (!file) {
      throw new BadRequestException('no file');
    }
    await this.productService.createProductOne(file, upsertProductDto);

    return new NullResponseDto();
  }

  /**
   * 상품 수정
   */
  @Put('/:productIdx')
  @AuthCheck(2)
  @UseInterceptors(FileInterceptor('image', multerConfigProvider('img')))
  async updateProduct(
    @Body() upsertProductDto: UpsertProductDto,
    @Param('productIdx', ParseIntPipe) productIdx: number,
    @UploadedFile() file?: Express.Multer.File,
  ): Promise<NullResponseDto> {
    if (!file) {
    }

    await this.productService.amendProduct(file, productIdx, upsertProductDto);

    return new NullResponseDto();
  }

  /**
   * 상품 삭제
   */
  @Delete('/')
  @AuthCheck(2)
  async deleteProduct(
    @Param('productIdx', ParseIntPipe) productIdx: number,
  ): Promise<NullResponseDto> {
    await this.productService.removeProduct(productIdx);

    return new NullResponseDto();
  }
}
