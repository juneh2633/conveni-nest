import { User } from 'src/modules/auth/model/user.model';

export class ProductWithAuthDto {
  data: any;
  authStatus: string;
  rankIdx: number;
  constructor(datas: any) {
    Object.assign(this, datas);
  }

  static createResponse(user: User, data: any): ProductWithAuthDto {
    return new ProductWithAuthDto({
      data: data,
      authStatus: ProductWithAuthDto.setAuthState(user.rankIdx),
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
