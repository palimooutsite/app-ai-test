import { UserRole } from '@prisma/client';

export interface CurrentUser {
  sub: string;
  email: string;
  role: UserRole;
  companyId: string;
}
