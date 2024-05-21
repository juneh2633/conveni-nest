export class AccountWithStatus {
  idx: number;

  createdAt: Date;

  email: string;

  nickname: string;

  rankIdx: number;

  authStatus: 'false' | 'true' | 'expired';
}
