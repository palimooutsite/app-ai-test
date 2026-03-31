import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ExternalConnection } from '../../database/entities';
import { IntegrationsController } from './integrations.controller';
import { IntegrationsService } from './integrations.service';
import { BankProvider } from './providers/bank.provider';
import { EcommerceProvider } from './providers/ecommerce.provider';

@Module({
  imports: [TypeOrmModule.forFeature([ExternalConnection])],
  controllers: [IntegrationsController],
  providers: [IntegrationsService, BankProvider, EcommerceProvider]
})
export class IntegrationsModule {}
