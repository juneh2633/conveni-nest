import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import {
  IsArray,
  IsIn,
  IsNumber,
  IsOptional,
  IsString,
  ValidateIf,
  ValidateNested,
} from 'class-validator';

class Event {
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  @ApiProperty({
    description: '회사idx',
    default: 1,
  })
  companyIdx: number;

  @IsNumber()
  @IsOptional()
  @Transform(({ value }) => (!value ? null : parseInt(value)))
  @Type(() => Number)
  @ApiProperty({
    description: '행사idx',
    default: 1,
  })
  eventIdx: number | null;

  @IsNumber()
  @IsOptional()
  @Transform(({ value }) => (!value ? null : parseInt(value)))
  @ApiProperty({
    description: '할인 행사일 경우 가격',
    default: null,
  })
  eventPrice?: number | null;
}

export class UpsertProductDto {
  @IsNumber()
  @Type(() => Number)
  @ApiProperty({
    description: '카테고리idx',
    default: 1,
  })
  categoryIdx: number;

  @IsString()
  @ApiProperty({
    description: '상품이름',
    default: '핫식스',
  })
  name: string;

  @IsNumber()
  @Type(() => Number)
  @ApiProperty({
    description: '상품가격',
    default: 2200,
  })
  price: number;

  @IsOptional()
  @Type(() => Event)
  @ApiProperty({
    description: 'event정보',
    type: [Event],
    default: [
      { companyIdx: 1, eventIdx: 1, eventPrice: null },
      { companyIdx: 2, eventIdx: 2, eventPrice: null },
      { companyIdx: 3, eventIdx: 1, eventPrice: null },
    ],
  })
  eventInfo?: Event[];
}
