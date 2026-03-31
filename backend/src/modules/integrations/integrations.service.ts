import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { CurrentUser } from '../../common/interfaces/current-user.interface';
import { BankProvider } from './providers/bank.provider';
import { EcommerceProvider } from './providers/ecommerce.provider';

@Injectable()
export class IntegrationsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly bankProvider: BankProvider,
    private readonly ecommerceProvider: EcommerceProvider
  ) {}

  async syncBank(currentUser: CurrentUser) {
    const conn = await this.prisma.externalConnection.findFirst({
      where: { companyId: currentUser.companyId, provider: 'BANK_API', isActive: true }
    });

    if (!conn) {
      return { imported: 0, reason: 'No bank connection configured' };
    }

    const transactions = await this.bankProvider.pullTransactions(conn.id);
    return { imported: transactions.length };
  }

  syncShopee(currentUser: CurrentUser) {
    return this.ecommerceProvider.syncShopee(currentUser.companyId);
  }

  syncTokopedia(currentUser: CurrentUser) {
    return this.ecommerceProvider.syncTokopedia(currentUser.companyId);
  }
}
