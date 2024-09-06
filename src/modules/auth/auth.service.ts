import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { SignInDto } from './dto/request/auth.dto';
import { compareSync, hashSync } from 'bcrypt';
import { SignUpDto } from './dto/request/sign-up.dto';
import { RedisCacheService } from 'src/common/redis/redis.service';
import { User } from './model/user.model';
@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly redis: RedisCacheService,
    private readonly prisma: PrismaService,
  ) {}

  async signIn(signInDto: SignInDto): Promise<string> {
    const account = await this.prisma.account.findFirst({
      where: { email: signInDto.email, deletedAt: null },
    });
    const passwordMatch = compareSync(signInDto.pw, account.password);

    if (!account || !passwordMatch) {
      throw new UnauthorizedException('login fail');
    }

    return await this.jwtService.signAsync({
      idx: account.idx,
      createdAt: account.createdAt,
      email: account.email,
      nickname: account.nickname,
      rankIdx: account.rankIdx,
    });
  }

  async signUp(signUpDto: SignUpDto): Promise<void> {
    const [accountCheck, nicknameCheck, verifiedEmail] = await Promise.all([
      this.prisma.account.findFirst({
        where: { email: signUpDto.email, deletedAt: null },
      }),
      this.prisma.account.findFirst({
        where: { nickname: signUpDto.nickname, deletedAt: null },
      }),
      this.redis.get(`verifiedEmails:${signUpDto.email}`),
    ]);

    if (accountCheck) {
      throw new ConflictException('email duplicate');
    }
    if (!verifiedEmail) {
      throw new ForbiddenException('not verified email');
    }

    if (!nicknameCheck) {
      throw new ConflictException('nickname duplicate');
    }

    await this.prisma.account.create({
      data: {
        password: hashSync(signUpDto.password, 1),
        email: signUpDto.nickname,
        nickname: signUpDto.nickname,
      },
    });
  }

  async withdraw(user: User) {
    const now = Date();
    await this.prisma.account.update({
      where: { idx: user.idx },
      data: {
        deletedAt: now,
      },
    });
  }
}
