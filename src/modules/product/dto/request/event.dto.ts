import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import { IsNumber, IsOptional } from 'class-validator';
export class EventDto {
  @IsNumber()
  @Type(() => Number)
  @ApiProperty({
    description: '회사idx',
    default: 1,
  })
  companyIdx: number;

  @IsNumber()
  @IsOptional()
  @Transform(({ value }) => (value === null ? null : Number(value)))
  @Type(() => Number)
  @ApiProperty({
    description: '행사idx',
    default: 1,
  })
  eventIdx: number | null;

  @IsNumber()
  @IsOptional()
  @Transform(({ value }) => (value === null ? null : Number(value)))
  @ApiProperty({
    description: '할인 행사일 경우 가격',
    default: null,
  })
  eventPrice?: number | null;
}
