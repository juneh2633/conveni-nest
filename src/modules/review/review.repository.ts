import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { ReviewWithAccount } from './model/review-with-account.model';

@Injectable()
export class ReviewRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async selectReview(
    productIdx: number,
    limit: number,
    offset: number,
  ): Promise<ReviewWithAccount[]> {
    return this.prismaService.review.findMany({
      where: {
        productIdx: productIdx,
      },
      orderBy: {
        idx: 'desc',
      },
      take: limit,
      skip: offset,

      select: {
        idx: true,
        productIdx: true,
        accountIdx: true,
        content: true,
        score: true,
        createdAt: true,
        account: {
          select: {
            idx: true,
            nickname: true,
          },
        },
      },
    });
  }

  async insertReview(
    productIdx: number,
    accountIdx: number,
    content: string,
    score: number,
    prismaTx?: Prisma.TransactionClient,
  ): Promise<void> {
    const prisma = prismaTx ? prismaTx : this.prismaService;
    await prisma.review.create({
      data: {
        product: {
          connect: { idx: productIdx },
        },
        account: {
          connect: { idx: accountIdx },
        },
        content: content,
        score: score,
      },
    });
  }

  async updateProductScore(
    productIdx: number,
    prismaTx?: Prisma.TransactionClient,
  ): Promise<void> {
    const prisma = prismaTx ? prismaTx : this.prismaService;
    const query = await prisma.review.aggregate({
      _avg: {
        score: true,
      },
      where: {
        productIdx: productIdx,
      },
    });
    const avg = query._avg.score;
    await prisma.product.update({
      where: {
        idx: productIdx,
      },
      data: {
        score: avg,
      },
    });
  }
}
