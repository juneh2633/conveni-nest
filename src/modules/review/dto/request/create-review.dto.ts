import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNumber, IsString, Max, Min } from 'class-validator';

export class CreateReviewDto {
  @ApiProperty({
    description: '리뷰 메세지',
    default: '맛있어요',
  })
  @IsString()
  content: string;

  @IsNumber()
  @Type(() => Number)
  @Max(5)
  @Min(0)
  @ApiProperty({
    description: '평점',
    default: 5,
  })
  score: number;
}
