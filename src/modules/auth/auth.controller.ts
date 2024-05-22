import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignInDto } from './dto/request/auth.dto';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOkResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { TokenResponseDto } from './dto/response/token.dto';
import { AuthGuard } from '@nestjs/passport';
import { SignUpDto } from './dto/request/sign-up.dto';
import { NullResponseDto } from './dto/response/null-response.dto';
import { Rank } from 'src/common/decorator/rank.decorator';
import { RankGuard } from 'src/common/guard/auth.guard';
import { User } from './model/user.model';
import { GetUser } from 'src/common/decorator/get-user.decorator';

@ApiTags('Auth API')
@Controller('account')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/login')
  @HttpCode(200)
  @ApiOperation({ summary: 'login', description: 'login' })
  @ApiBody({ type: SignInDto })
  @ApiOkResponse({ description: 'login success', type: TokenResponseDto })
  @ApiUnauthorizedResponse({ description: 'login fail' })
  async signIn(@Body() signInDto: SignInDto): Promise<TokenResponseDto> {
    const accessToken = await this.authService.signIn(signInDto);

    return {
      accessToken: `Bearer ${accessToken}`,
    };
  }

  @Post('/')
  @HttpCode(200)
  async signUp(@Body() signUpDto: SignUpDto): Promise<NullResponseDto> {
    await this.authService.signUp(signUpDto);

    return new NullResponseDto();
  }

  @Delete('/')
  @Rank(1)
  @UseGuards(RankGuard)
  @HttpCode(201)
  async withdrawAccount(@GetUser() user: User): Promise<NullResponseDto> {
    await this.authService.withdraw(user);

    return new NullResponseDto();
  }
}
