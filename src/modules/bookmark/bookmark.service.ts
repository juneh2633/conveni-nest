import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { BookmarkRepository } from './bookmark.repository';

@Injectable()
export class BookmarkService {
  constructor(private readonly bookmarkRepository: BookmarkRepository) {}

  async createBookmark(productIdx: number, accountIdx: number): Promise<void> {
    const bookmarkCheck = await this.bookmarkRepository.selectBookmarkedState(
      accountIdx,
      productIdx,
    );
    if (bookmarkCheck) {
      throw new UnauthorizedException('already bookmarked');
    }

    try {
      await this.bookmarkRepository.insertBookmark(productIdx, accountIdx);
    } catch (err) {
      // product가 존재하지 않는 경우
      if (err.code === '23503') {
        throw new BadRequestException('alreadyBookmarked');
      }
      throw err;
    }
  }

  async removeBookamrk(productIdx: number, accountIdx: number): Promise<void> {
    await this.bookmarkRepository.deleteBookmark(productIdx, accountIdx);
  }
}
