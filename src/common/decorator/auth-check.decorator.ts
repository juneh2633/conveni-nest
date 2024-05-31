import {
  BadRequestException,
  ForbiddenException,
  UnauthorizedException,
  UseGuards,
  applyDecorators,
} from '@nestjs/common';
import { Rank } from './rank.decorator';
import { RankGuard } from '../guard/auth.guard';
import { ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { ApiException } from './api-exception.decorator';

export const AuthCheck = (rank: number) => {
  return applyDecorators(
    Rank(rank),
    UseGuards(RankGuard),
    ApiBearerAuth(),
    ApiException(new UnauthorizedException('token expired')),
    ApiException(new UnauthorizedException('Invalid token')),
    ApiException(new ForbiddenException('No permission')),
  );
};
