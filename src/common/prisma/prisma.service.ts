import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  async onModuleInit() {
    try {
      await this.$connect();
    } catch (error) {
      console.error('Failed to connect to the database:', error);
    }
  }

  async onModuleDestroy() {
    try {
      await this.$disconnect();
    } catch (error) {
      console.error('Failed to disconnect from the database:', error);
    }
  }
}
