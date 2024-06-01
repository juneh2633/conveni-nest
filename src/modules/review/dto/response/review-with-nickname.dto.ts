import { User } from 'src/modules/auth/model/user.model';

export class ReviewWithNicknameDto {
  data: any;
  authStatus: 'expired' | 'false' | 'true';
  rankIdx: number;
  constructor(datas: any) {
    Object.assign(this, datas);
  }
  static createResponse(user: User, data: any): ReviewWithNicknameDto {
    return new ReviewWithNicknameDto({
      data: data,
      authStatus: ReviewWithNicknameDto.setAuthState(user.rankIdx),
      rankIdx: user.rankIdx,
    });
  }
  private static setAuthState(rankInd: number): 'expired' | 'false' | 'true' {
    if (rankInd === -1) {
      return 'expired';
    }
    if (rankInd === 0) {
      return 'false';
    }

    return 'true';
  }
}
