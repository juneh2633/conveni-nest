import { Module } from '@nestjs/common';
import { AccountController } from './account.controller';
import { AccountService } from './account.service';
import { PrismaModule } from 'src/common/prisma/prisma.module';
import { RedisModule } from 'src/common/redis/redis.module';

@Module({
  imports: [PrismaModule, RedisModule],
  providers: [AccountService],
  controllers: [AccountController],
})
export class AccountModule {}
