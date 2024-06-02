import { Body, Controller, Delete, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignInDto } from './dto/request/auth.dto';
import { ApiTags } from '@nestjs/swagger';
import { TokenResponseDto } from './dto/response/token.dto';
import { SignUpDto } from './dto/request/sign-up.dto';
import { NullResponseDto } from 'src/common/dto/null-response.dto';
import { User } from './model/user.model';
import { GetUser } from 'src/common/decorator/get-user.decorator';
import { AuthCheck } from 'src/common/decorator/auth-check.decorator';

@ApiTags('Auth API')
@Controller('account')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /**
   * 로그인
   */
  @Post('/login')
  async signIn(@Body() signInDto: SignInDto): Promise<TokenResponseDto> {
    const accessToken = await this.authService.signIn(signInDto);

    return {
      accessToken: accessToken,
    };
  }

  /**
   * 회원가입
   */
  @Post('/')
  async signUp(@Body() signUpDto: SignUpDto): Promise<NullResponseDto> {
    await this.authService.signUp(signUpDto);

    return new NullResponseDto();
  }

  /**
   * 회원탈퇴
   */
  @Delete('/')
  @AuthCheck(1)
  async withdrawAccount(@GetUser() user: User): Promise<NullResponseDto> {
    await this.authService.withdraw(user);

    return new NullResponseDto();
  }
}
