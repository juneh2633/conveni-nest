import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import { IsArray, IsNumber, IsOptional, IsString } from 'class-validator';

export class GetProductsBySearchDto {
  @IsString()
  @IsOptional()
  @ApiProperty({
    description: '검색어',
    default: '핫식스',
  })
  keyword?: string;

  @IsNumber()
  @Type(() => Number)
  @ApiProperty({
    description: '페이지',
    default: 1,
  })
  page: number;

  @IsOptional()
  @IsArray()
  @Transform(({ value }) =>
    Array.isArray(value) ? value.map(Number) : [Number(value)],
  )
  @ApiProperty({
    description: '이벤트 필터',
    default: [1, 2, 3],
  })
  eventFilter?: number[];

  @IsOptional()
  @IsArray()
  @Transform(({ value }) =>
    Array.isArray(value) ? value.map(Number) : [Number(value)],
  )
  @ApiProperty({
    description: '카테고리 필터',
    default: [1, 2, 3],
  })
  categoryFilter?: number[];
}
