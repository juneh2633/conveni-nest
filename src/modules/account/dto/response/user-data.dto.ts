import { User } from 'src/modules/auth/model/user.model';

export class UserWithStatus {
  data: User;
  authStatus: 'true' | 'false' | 'expired';
}
