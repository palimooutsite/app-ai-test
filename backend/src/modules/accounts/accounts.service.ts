import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { CurrentUser } from '../../common/interfaces/current-user.interface';
import { CreateAccountDto } from './dto/create-account.dto';

@Injectable()
export class AccountsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(currentUser: CurrentUser, dto: CreateAccountDto) {
    return this.prisma.account.create({
      data: {
        companyId: currentUser.companyId,
        ...dto
      }
    });
  }

  async list(currentUser: CurrentUser) {
    return this.prisma.account.findMany({
      where: { companyId: currentUser.companyId, isActive: true },
      orderBy: { code: 'asc' }
    });
  }

  async deactivate(currentUser: CurrentUser, accountId: string) {
    const hasLines = await this.prisma.journalLine.count({
      where: {
        accountId,
        journalEntry: { companyId: currentUser.companyId }
      }
    });

    if (hasLines > 0) {
      throw new BadRequestException('Cannot deactivate account with journal lines');
    }

    return this.prisma.account.update({
      where: { id: accountId, companyId: currentUser.companyId },
      data: { isActive: false }
    });
  }
}
