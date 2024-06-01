import { PrismaService } from 'src/common/prisma/prisma.service';

import { Bookmark, Prisma } from '@prisma/client';
import { Injectable } from '@nestjs/common';

@Injectable()
export class BookmarkRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async selectBookmarkedState(
    accountIdx: number,
    productIdx: number,
  ): Promise<Bookmark> {
    return await this.prismaService.bookmark.findFirst({
      where: {
        accountIdx: accountIdx,
        productIdx: productIdx,
      },
    });
  }

  async selectBookmarkAll(accountIdx: number): Promise<Bookmark[]> {
    return await this.prismaService.bookmark.findMany({
      where: {
        accountIdx: accountIdx,
      },
      distinct: ['productIdx'],
    });
  }
  async insertBookmark(
    productIdx: number,
    accountIdx: number,
    prismaTx?: Prisma.TransactionClient,
  ): Promise<void> {
    const prisma = prismaTx ? prismaTx : this.prismaService;
    await prisma.bookmark.create({
      data: {
        account: {
          connect: { idx: accountIdx },
        },
        product: {
          connect: { idx: productIdx },
        },
      },
    });
  }

  async deleteBookmark(
    productIdx: number,
    accountIdx: number,
    prismaTx?: Prisma.TransactionClient,
  ): Promise<void> {
    const prisma = prismaTx ? prismaTx : this.prismaService;
    await prisma.bookmark.deleteMany({
      where: {
        accountIdx: accountIdx,
        productIdx: productIdx,
      },
    });
  }
}
