import {
  Body,
  Controller,
  Get,
  HttpCode,
  Put,
  UseGuards,
} from '@nestjs/common';
import { AccountService } from './account.service';
import { ApiBearerAuth } from '@nestjs/swagger';

import { RankGuard } from 'src/common/guard/auth.guard';
import { Rank } from 'src/common/decorator/rank.decorator';
import { UserWithStatus } from './dto/response/user-data.dto';
import { User } from '../auth/model/user.model';
import { GetUser } from 'src/common/decorator/get-user.decorator';
import { UpdatePwDto } from './dto/request/update-pw.dto';
import { NullResponseDto } from 'src/common/dto/null-response.dto';

@Controller('account')
export class AccountController {
  constructor(private readonly accountService: AccountService) {}

  @Get('/')
  @ApiBearerAuth()
  @Rank(1)
  @UseGuards(RankGuard)
  @HttpCode(200)
  async findUserData(@GetUser() user: User): Promise<UserWithStatus> {
    return {
      data: user,
      authStatus: 'true',
    };
  }

  @Put('/pw')
  @HttpCode(201)
  async recoveryPw(@Body() updatePwDto: UpdatePwDto): Promise<NullResponseDto> {
    await this.accountService.updatePw(updatePwDto.email, updatePwDto.pw);
    return new NullResponseDto();
  }

  @Put('/pw/login')
  @HttpCode(201)
  async recoveryPwLogin(
    @Body() updatePwDto: UpdatePwDto,
  ): Promise<NullResponseDto> {
    await this.accountService.updatePw(updatePwDto.email, updatePwDto.pw);
    return new NullResponseDto();
  }
}
