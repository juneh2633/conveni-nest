import { User } from 'src/modules/auth/model/user.model';
import { ProductWithEventHistoryDto } from '../product-with-event-history.dto';
import { ProductWithEvent } from '../../model/product-with-event.model';

export class ProductManyDto {
  data: Array<ProductWithEvent>;
  authStatus: string;
  rankIdx: number;
  constructor(datas: Partial<ProductManyDto>) {
    Object.assign(this, datas);
  }

  static createResponse(
    user: User,
    data: Array<ProductWithEvent>,
  ): ProductManyDto {
    let authStatus = 'true';
    if (user.rankIdx === -1) {
      authStatus = 'expired';
    }
    if (user.rankIdx === 0) {
      authStatus = 'false';
    }

    return new ProductManyDto({
      data: data,
      authStatus: authStatus,
      rankIdx: user.rankIdx,
    });
  }
}
