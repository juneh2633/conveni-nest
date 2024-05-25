import { Module } from '@nestjs/common';
import { BookmarkService } from './bookmark.service';
import { BookmarkController } from './bookmark.controller';
import { PrismaModule } from 'src/common/prisma/prisma.module';
import { BookmarkRepository } from './bookmark.repository';

@Module({
  imports: [PrismaModule],
  providers: [BookmarkService],
  controllers: [BookmarkController],
})
export class BookmarkModule {}
