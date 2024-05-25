import { Module } from '@nestjs/common';
import { AuthModule } from './modules/auth/auth.module';
import { ProductModule } from './modules/product/product.module';
import { BookmarkModule } from './modules/bookmark/bookmark.module';

import { AccountModule } from './modules/account/account.module';
import { EmailModule } from './modules/email/email.module';
import { EventModule } from './modules/event/event.module';

@Module({
  imports: [
    AuthModule,
    AccountModule,
    ProductModule,
    BookmarkModule,
    EmailModule,
    EventModule,
  ],
  providers: [],
  controllers: [],
})
export class AppModule {}
