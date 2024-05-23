import { Module } from '@nestjs/common';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';
import { RedisModule } from 'src/common/redis/redis.module';
import { PrismaModule } from 'src/common/prisma/prisma.module';
import { ProductRepository } from './product.repository';
import { EventRepository } from './event.repository';

@Module({
  imports: [RedisModule, PrismaModule],
  providers: [ProductService, ProductRepository, EventRepository],
  controllers: [ProductController],
})
export class ProductModule {}
