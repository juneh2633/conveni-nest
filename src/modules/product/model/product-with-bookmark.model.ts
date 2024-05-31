import { Bookmark, Product } from '@prisma/client';

export type ProductWithBookmark = Product & {
  bookmarked: boolean;
};
