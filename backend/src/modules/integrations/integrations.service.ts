import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CurrentUser } from '../../common/interfaces/current-user.interface';
import { ConnectionProvider } from '../../database/enums';
import { ExternalConnection } from '../../database/entities';
import { BankProvider } from './providers/bank.provider';
import { EcommerceProvider } from './providers/ecommerce.provider';

@Injectable()
export class IntegrationsService {
  constructor(
    @InjectRepository(ExternalConnection)
    private readonly externalConnectionsRepository: Repository<ExternalConnection>,
    private readonly bankProvider: BankProvider,
    private readonly ecommerceProvider: EcommerceProvider
  ) {}

  async syncBank(currentUser: CurrentUser) {
    const conn = await this.externalConnectionsRepository.findOne({
      where: { companyId: currentUser.companyId, provider: ConnectionProvider.BANK_API, isActive: true }
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
