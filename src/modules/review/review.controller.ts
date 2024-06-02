import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
} from '@nestjs/common';
import { ReviewService } from './review.service';
import { ApiTags } from '@nestjs/swagger';
import { AuthCheck } from 'src/common/decorator/auth-check.decorator';
import { GetUser } from 'src/common/decorator/get-user.decorator';
import { User } from '../auth/model/user.model';
import { NullResponseDto } from 'src/common/dto/null-response.dto';
import { CreateReviewDto } from './dto/request/create-review.dto';
import { GetReviewDto } from './dto/request/get-review.dto';
import { ReviewWithNicknameDto } from './dto/response/review-with-nickname.dto';

@ApiTags('Review API')
@Controller('review')
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  /**
   * 상품의 리뷰 가져오기
   */
  @Get('/product/:productIdx')
  @AuthCheck(0)
  async findReview(
    @GetUser() user: User,
    @Param('productIdx', ParseIntPipe) productIdx: number,
    @Query() getReviewDto: GetReviewDto,
  ): Promise<ReviewWithNicknameDto> {
    const reviewList = await this.reviewService.getReview(
      productIdx,
      getReviewDto.page,
    );
    return ReviewWithNicknameDto.createResponse(user, reviewList);
  }

  /**
   * 상품의 리뷰 가져오기
   */
  @Post('/product/:productIdx')
  @AuthCheck(1)
  async createReview(
    @GetUser() user: User,
    @Param('productIdx', ParseIntPipe) productIdx: number,
    @Body() createReviewDto: CreateReviewDto,
  ): Promise<NullResponseDto> {
    await this.reviewService.createReview(
      user,
      productIdx,
      createReviewDto.content,
      createReviewDto.score,
    );
    return new NullResponseDto();
  }
}
