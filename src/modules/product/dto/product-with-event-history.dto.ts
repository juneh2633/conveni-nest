import { EventHistory } from '../model/event-history.model';
import { Product } from '../model/product.model';

export class ProductWithEventHistoryDto {
  productList: Array<Product>;
  eventList: Array<EventHistory>;
}
