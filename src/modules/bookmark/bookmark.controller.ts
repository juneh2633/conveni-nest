import {
  Body,
  Controller,
  Delete,
  Param,
  ParseIntPipe,
  Post,
} from '@nestjs/common';
import { BookmarkService } from './bookmark.service';
import { AuthCheck } from 'src/common/decorator/auth-check.decorator';
import { GetUser } from 'src/common/decorator/get-user.decorator';
import { User } from '../auth/model/user.model';
import { NullResponseDto } from 'src/common/dto/null-response.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Bookmark API')
@Controller('bookmark')
export class BookmarkController {
  constructor(private readonly bookmarkService: BookmarkService) {}

  /**
   * 북마크 하기
   */
  @Post('/product/:product')
  @AuthCheck(1)
  async bookmarkProduct(
    @GetUser() user: User,
    @Param('productIdx', ParseIntPipe) productIdx: number,
  ): Promise<NullResponseDto> {
    await this.bookmarkService.createBookmark(productIdx, user.idx);
    return new NullResponseDto();
  }

  /**
   * 북마크 해제하기
   */
  @Delete('/product/:product')
  @AuthCheck(1)
  async unBookmarkProduct(
    @GetUser() user: User,
    @Param('productIdx', ParseIntPipe) productIdx: number,
  ): Promise<NullResponseDto> {
    await this.bookmarkService.removeBookamrk(productIdx, user.idx);
    return new NullResponseDto();
  }
}
