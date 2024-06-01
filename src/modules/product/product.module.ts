import { Module } from '@nestjs/common';
import { ProductController } from './product.controller';

import { RedisModule } from 'src/common/redis/redis.module';
import { PrismaModule } from 'src/common/prisma/prisma.module';

import { AwsModule } from 'src/common/aws/aws.module';
import { ProductRepository } from './repository/product.repository';
import { EventRepository } from './repository/event.repository';
import { ProductService } from './product.service';
import { BookmarkModule } from '../bookmark/bookmark.module';

@Module({
  imports: [RedisModule, PrismaModule, AwsModule, BookmarkModule],
  providers: [ProductService, ProductRepository, EventRepository],
  controllers: [ProductController],
})
export class ProductModule {}
