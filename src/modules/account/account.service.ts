import { ForbiddenException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { hashSync } from 'bcrypt';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { RedisCacheService } from 'src/common/redis/redis.service';

@Injectable()
export class AccountService {
  constructor(
    private readonly redis: RedisCacheService,
    private readonly prisma: PrismaService,
  ) {}

  async updatePw(email: string, pw: string): Promise<void> {
    const verifiedCheck = await this.redis.get(`verifiedEmails:${email}`);
    if (!verifiedCheck) {
      throw new ForbiddenException('not verified email');
    }

    await this.prisma.account.updateMany({
      where: { email: email },
      data: {
        password: hashSync(pw, 1),
      },
    });
  }
}
