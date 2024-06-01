import { Account, Review } from '@prisma/client';

export type ReviewWithAccount = Review & {
  account: {
    idx: number;
    nickname: string;
  };
};
