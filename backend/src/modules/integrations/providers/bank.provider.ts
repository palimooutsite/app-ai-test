import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class BankProvider {
  private readonly logger = new Logger(BankProvider.name);

  // Replace with HTTP integration to your bank aggregator API provider.
  async pullTransactions(connectionId: string) {
    this.logger.log(`Syncing bank transactions for connection ${connectionId}`);
    return [];
  }
}
