import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

import { IsNumber, Min } from 'class-validator';

export class GetProductsPagebleDto {
  /**
   * 페이지 1이상 정수
   * @example 1
   */
  @IsNumber()
  @Type(() => Number)
  @Min(1, { message: 'Page number must be at least 1' })
  page: number;
}
