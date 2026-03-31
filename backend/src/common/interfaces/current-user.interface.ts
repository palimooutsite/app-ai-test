import { UserRole } from '../../database/enums';

export interface CurrentUser {
  sub: string;
  email: string;
  role: UserRole;
  companyId: string;
}
