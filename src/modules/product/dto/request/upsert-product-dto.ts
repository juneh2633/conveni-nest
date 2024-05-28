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
  companyIdx: number;

  @IsNumber()
  @IsOptional()
  @Transform(({ value }) => (!value ? null : parseInt(value)))
  @Type(() => Number)
  eventIdx: number | null;

  //   @ValidateIf((o) => o.eventPrice !== undefined)
  @IsNumber()
  @IsOptional()
  @Transform(({ value }) => (!value ? null : parseInt(value)))
  eventPrice?: number | null;
}
export class UpsertProductDto {
  @IsNumber()
  @Type(() => Number)
  categoryIdx: number;

  @IsString()
  name: string;

  @IsNumber()
  @Type(() => Number)
  price: number;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => Event)
  eventInfo?: Array<Event>;
}
