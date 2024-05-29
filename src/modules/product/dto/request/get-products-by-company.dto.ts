import { Transform, Type } from 'class-transformer';
import { IsArray, IsIn, IsNumber, IsOptional, IsString } from 'class-validator';

export class GetProductsByCompanyDto {
  @IsNumber()
  @Type(() => Number)
  page: number;

  @IsString()
  @IsIn(['main', 'all'])
  option: 'main' | 'all';
}
