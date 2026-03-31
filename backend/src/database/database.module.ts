import { Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  Account,
  BankTransaction,
  Company,
  ExternalConnection,
  JournalEntry,
  JournalLine,
  User
} from './entities';

@Global()
@Module({
  imports: [
    ConfigModule,
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        url: configService.get<string>('DATABASE_URL'),
        entities: [Account, BankTransaction, Company, ExternalConnection, JournalEntry, JournalLine, User],
        synchronize: false
      })
    })
  ],
  exports: [TypeOrmModule]
})
export class DatabaseModule {}
