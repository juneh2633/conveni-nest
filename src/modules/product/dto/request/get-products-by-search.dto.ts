import { Transform, Type } from 'class-transformer';
import { IsArray, IsNumber, IsOptional, IsString } from 'class-validator';

export class GetProductsBySearchDto {
  @IsString()
  @IsOptional()
  keyword?: string;

  @IsNumber()
  @Type(() => Number)
  page: number;

  @IsOptional()
  @Transform(({ value }) => {
    if (typeof value === 'string') {
      if (value === '') {
        return undefined;
      }
      return value.replace('{', '').replace('}', '').split(',').map(Number);
    }
    return undefined;
  })
  eventFilter?: Array<number>;

  @IsOptional()
  @Transform(({ value }) => {
    if (typeof value === 'string') {
      if (value === '') {
        return undefined;
      }
      return value.replace('{', '').replace('}', '').split(',').map(Number);
    }
    return undefined;
  })
  categoryFilter?: Array<number>;
}
