import { Module } from '@nestjs/common';
import { IntegrationsController } from './integrations.controller';
import { IntegrationsService } from './integrations.service';
import { BankProvider } from './providers/bank.provider';
import { EcommerceProvider } from './providers/ecommerce.provider';

@Module({
  controllers: [IntegrationsController],
  providers: [IntegrationsService, BankProvider, EcommerceProvider]
})
export class IntegrationsModule {}
