import { IsEmail, IsString } from 'class-validator';

export class UpdatePwDto {
  @IsEmail()
  email: string;
  @IsString()
  pw: string;
}
