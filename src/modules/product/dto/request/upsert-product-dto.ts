import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import {
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { EventDto } from './event.dto';
import { IsEventArray } from 'src/common/decorator/is-event.decorator';

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
  @Type(() => EventDto)
  @IsEventArray({ message: 'eventInfo object error' })
  @Transform(({ value }) => {
    return JSON.parse(value);
  })
  @ApiProperty({
    description: 'event정보',
    type: [EventDto],
    default: [
      { companyIdx: 1, eventIdx: 1, eventPrice: null },
      { companyIdx: 2, eventIdx: 2, eventPrice: null },
      { companyIdx: 3, eventIdx: 1, eventPrice: null },
    ],
  })
  eventInfo?: EventDto[];

  @ApiProperty({ type: 'string', format: 'binary' })
  image: any;
}
