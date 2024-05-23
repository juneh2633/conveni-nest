import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/common/prisma/prisma.module';
import { RedisModule } from 'src/common/redis/redis.module';
import { EventRepository } from '../product/event.repository';
import { EventService } from './event.service';

@Module({
  imports: [RedisModule, PrismaModule],
  providers: [EventRepository, EventService],
  exports: [EventRepository],
})
export class EventModule {}
