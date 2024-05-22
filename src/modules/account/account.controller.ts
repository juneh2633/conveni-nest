import {
  Controller,
  Get,
  HttpCode,
  Query,
  Req,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AccountService } from './account.service';
import { ApiBearerAuth } from '@nestjs/swagger';

import { RankGuard } from 'src/common/guard/auth.guard';
import { Rank } from 'src/common/decorator/rank.decorator';
import { UserWithStatus } from './dto/response/user-data.dto';
import { User } from '../auth/model/user.model';
import { GetUser } from 'src/common/decorator/get-user.decorator';

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
}
