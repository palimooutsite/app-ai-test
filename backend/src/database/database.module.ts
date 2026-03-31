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
      useFactory: (configService: ConfigService) => {
        const databaseUrl = configService.get<string>('DATABASE_URL');
        const dbPort = configService.get<number>('DB_PORT');

        return {
          type: 'postgres',
          ...(databaseUrl
            ? { url: databaseUrl }
            : {
                host: configService.get<string>('DB_HOST'),
                port: dbPort,
                username: configService.get<string>('DB_USER'),
                password: configService.get<string>('DB_PASSWORD'),
                database: configService.get<string>('DB_NAME')
              }),
          entities: [Account, BankTransaction, Company, ExternalConnection, JournalEntry, JournalLine, User],
          synchronize: false
        };
      }
    })
  ],
  exports: [TypeOrmModule]
})
export class DatabaseModule {}
