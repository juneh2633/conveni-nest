import { Type } from 'class-transformer';

import { IsInt, IsNumber } from 'class-validator';

export class GetProductsPagebleDto {
  @IsNumber()
  @Type(() => Number)
  page: number;
}
