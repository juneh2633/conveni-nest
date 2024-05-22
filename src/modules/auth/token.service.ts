import { Injectable } from '@nestjs/common';
import { JwtService, TokenExpiredError } from '@nestjs/jwt';
import { User } from './model/user.model';

@Injectable()
export class TokenService {
  constructor(private readonly jwtService: JwtService) {}

  verifyToken(bearerToken: string): User {
    try {
      const token = bearerToken.split(' ')[1];
      const payload = this.jwtService.verify<User>(token);

      return payload;
    } catch (err) {
      if (err instanceof TokenExpiredError) {
        return {
          idx: 1,
          createdAt: null,
          email: null,
          nickname: null,
          rankIdx: -1,
        };
      } else {
        throw err;
      }
    }
  }

  noLoginToken(): User {
    return {
      idx: 1,
      createdAt: null,
      email: null,
      nickname: null,
      rankIdx: 0,
    };
  }
}
