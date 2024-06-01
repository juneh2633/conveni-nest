import { Injectable } from '@nestjs/common';
import { ReviewRepository } from './review.repository';
import { User } from '../auth/model/user.model';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { ReviewWithNicknameEntity } from './entity/ReviewWithNickname.entity';

@Injectable()
export class ReviewService {
  constructor(
    private readonly reviewRepository: ReviewRepository,
    private readonly prismaService: PrismaService,
  ) {}

  async createReview(
    user: User,
    productIdx: number,
    content: string,
    score: number,
  ): Promise<void> {
    await this.prismaService.$transaction(async (prisma) => {
      await this.reviewRepository.insertReview(
        productIdx,
        user.idx,
        content,
        score,
        prisma,
      );
      await this.reviewRepository.updateProductScore(productIdx, prisma);
    });
  }

  async getReview(
    productIdx: number,
    page: number,
  ): Promise<ReviewWithNicknameEntity[]> {
    const reviewList = await this.reviewRepository.selectReview(
      productIdx,
      10,
      (page - 1) * 10,
    );
    return ReviewWithNicknameEntity.createMany(reviewList);
  }
}
