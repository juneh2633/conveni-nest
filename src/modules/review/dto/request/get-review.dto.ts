import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

import { IsNumber, Min } from 'class-validator';

export class GetReviewDto {
  @IsNumber()
  @Type(() => Number)
  @Min(1, { message: 'Page number must be at least 1' })
  @ApiProperty({
    description: '페이지',
    default: 1,
  })
  page: number;
}
