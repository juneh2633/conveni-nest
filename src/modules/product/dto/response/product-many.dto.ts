import { User } from 'src/modules/auth/model/user.model';
import { ProductWithEventHistoryDto } from '../product-with-event-history.dto';

export class ProductManyDto {
  data: any;
  authStatus: any;
  rankIdx: number;
  constructor(datas: Partial<ProductManyDto>) {
    Object.assign(this, datas);
  }

  static createResponse(
    user: User,
    productWithEventHistoryDto: ProductWithEventHistoryDto,
  ): ProductManyDto {
    const { productList, eventList } = productWithEventHistoryDto;
    let authStatus = 'true';
    if (user.rankIdx === -1) {
      authStatus = 'expired';
    }
    if (user.rankIdx === 0) {
      authStatus = 'false';
    }
    const eventMap = eventList.reduce((acc, event) => {
      if (!acc[event.productIdx]) {
        acc[event.productIdx] = [];
      }
      acc[event.productIdx].push({
        companyIdx: event.companyIdx,
        eventIdx: event.eventIdx,
        price: event.price,
      });
      return acc;
    }, {});

    const productData = productList.map((product) => ({
      ...product,
      events: eventMap[product.idx] || [],
    }));

    return new ProductManyDto({
      data: { productList: productData },
      authStatus: authStatus,
      rankIdx: user.rankIdx,
    });
  }
}
