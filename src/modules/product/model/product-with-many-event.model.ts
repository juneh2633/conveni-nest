import { Event } from './event.model';

import { Product } from './product.model';

interface event {
  month: Date;
  events: Array<Event>;
}
export class ProductWithManyEvent {
  product: Product;
  eventInfo: Array<event>;
}
