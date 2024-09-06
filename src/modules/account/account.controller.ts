import {
  Body,
  Controller,
  ForbiddenException,
  Get,
  HttpCode,
  Put,
  UseGuards,
} from '@nestjs/common';
import { AccountService } from './account.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { RankGuard } from 'src/common/guard/auth.guard';
import { Rank } from 'src/common/decorator/rank.decorator';
import { UserWithStatus } from './dto/response/user-data.dto';
import { User } from '../auth/model/user.model';
import { GetUser } from 'src/common/decorator/get-user.decorator';
import { UpdatePwDto } from './dto/request/update-pw.dto';
import { NullResponseDto } from 'src/common/dto/null-response.dto';
import { AuthCheck } from 'src/common/decorator/auth-check.decorator';
import { ExceptionList } from 'src/common/decorator/exception-list.decorator';

@ApiTags('Account API')
@Controller('account')
export class AccountController {
  constructor(private readonly accountService: AccountService) {}

  /**
   * 유저 정보 가져오기
   */
  @Get('/')
  @AuthCheck(1)
  async findUserData(@GetUser() user: User): Promise<UserWithStatus> {
    return {
      data: user,
      authStatus: 'true',
    };
  }

  /**
   * 비밀번호 변경(로그인없이)
   */
  @Put('/pw')
  @ExceptionList([new ForbiddenException('not verified email')])
  async recoveryPw(@Body() updatePwDto: UpdatePwDto): Promise<NullResponseDto> {
    await this.accountService.updatePw(updatePwDto.email, updatePwDto.pw);
    return new NullResponseDto();
  }

  /**
   * 비밀번호 변경(로그인상태)
   */
  @Put('/pw/login')
  @ExceptionList([new ForbiddenException('not verified email')])
  async recoveryPwLogin(
    @Body() updatePwDto: UpdatePwDto,
  ): Promise<NullResponseDto> {
    await this.accountService.updatePw(updatePwDto.email, updatePwDto.pw);
    return new NullResponseDto();
  }
}
