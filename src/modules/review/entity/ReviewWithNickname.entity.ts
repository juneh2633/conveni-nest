import { Decimal } from '@prisma/client/runtime/library';
import { ReviewWithAccount } from '../model/review-with-account.model';

export class ReviewWithNicknameEntity {
  reviewIdx: number;
  productIdx: number;
  nickname: string;
  content: string;
  score: Decimal;
  createdAt: Date;
  constructor(data) {
    Object.assign(this, data);
  }

  public static createMany(
    reviewList: ReviewWithAccount[],
  ): ReviewWithNicknameEntity[] {
    return reviewList?.map((review) => {
      return new ReviewWithNicknameEntity({
        reviewIdx: review.idx,
        productIdx: review.productIdx,
        nickname: review.accountIdx,
        content: review.content,
        score: review.score,
        createdAt: review.createdAt,
      });
    });
  }
}
