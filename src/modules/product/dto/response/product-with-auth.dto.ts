import { User } from 'src/modules/auth/model/user.model';

export class ProductWithAuthDto {
  data: any;
  authStatus: string;
  rankIdx: number;
  constructor(datas: any) {
    Object.assign(this, datas);
  }

  static createResponse(user: User, data: any): ProductWithAuthDto {
    let authStatus = 'true';
    if (user.rankIdx === -1) {
      authStatus = 'expired';
    }
    if (user.rankIdx === 0) {
      authStatus = 'false';
    }

    return new ProductWithAuthDto({
      data: data,
      authStatus: authStatus,
      rankIdx: user.rankIdx,
    });
  }
}
