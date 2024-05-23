import { Decimal } from '@prisma/client/runtime/library';
interface objectIdx {
  idx: number;
}

export class Product {
  idx: number;
  categoryIdx: number;
  name: string;
  price: string;
  productImg: string;
  bookmark: Array<objectIdx>;
  score: Decimal;
  createdAt: Date;
}
