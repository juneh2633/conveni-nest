import { User } from 'src/modules/auth/model/user.model';
import { ProductWithManyEventEntity } from '../../entity/productWithManyEvent.entity';
import { ProductWithEventEntity } from '../../entity/ProductWithEvent.entity';

export class ProductWithAuthDto {
  data: ProductWithManyEventEntity | ProductWithEventEntity[];
  authStatus: 'expired' | 'false' | 'true';
  /**
   *  asdfasdfa
   */
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
