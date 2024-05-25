import { EventHistory } from './event-history.model';
import { Product } from './product.model';

export class ProductWithEvent extends Product {
  events: Array<EventHistory>;
}
