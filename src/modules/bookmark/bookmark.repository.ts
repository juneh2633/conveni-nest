import { PrismaService } from 'src/common/prisma/prisma.service';
import { User } from '../auth/model/user.model';

export class BookmarkRepository {
  constructor(private readonly prisma: PrismaService) {}
}
