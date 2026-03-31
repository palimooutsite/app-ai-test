import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class EcommerceProvider {
  private readonly logger = new Logger(EcommerceProvider.name);

  async syncShopee(companyId: string) {
    this.logger.log(`Syncing Shopee orders for company ${companyId}`);
    return { imported: 0 };
  }

  async syncTokopedia(companyId: string) {
    this.logger.log(`Syncing Tokopedia orders for company ${companyId}`);
    return { imported: 0 };
  }
}
