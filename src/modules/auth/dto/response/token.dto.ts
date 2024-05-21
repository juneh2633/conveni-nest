import { ApiProperty } from '@nestjs/swagger';

export class TokenResponseDto {
  @ApiProperty({
    description: '토큰',
    default: 'Barear token',
  })
  accessToken: string;
}
