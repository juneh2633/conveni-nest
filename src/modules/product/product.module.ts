import { Module } from '@nestjs/common';
import { ProductController } from './product.controller';

import { RedisModule } from 'src/common/redis/redis.module';
import { PrismaModule } from 'src/common/prisma/prisma.module';
import { ProductFacade } from './product.facade';
import { ProductService } from './service/product.service';
import { EventService } from './service/event.service';

import { AwsModule } from 'src/common/aws/aws.module';

@Module({
  imports: [RedisModule, PrismaModule, AwsModule],
  providers: [ProductFacade, ProductService, EventService],
  controllers: [ProductController],
})
export class ProductModule {}
