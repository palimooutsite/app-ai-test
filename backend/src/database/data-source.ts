import 'reflect-metadata';
import { DataSource } from 'typeorm';
import {
  Account,
  BankTransaction,
  Company,
  ExternalConnection,
  JournalEntry,
  JournalLine,
  User
} from './entities';

export default new DataSource({
  type: 'postgres',
  url: process.env.DATABASE_URL,
  entities: [Account, BankTransaction, Company, ExternalConnection, JournalEntry, JournalLine, User],
  migrations: ['src/database/migrations/*.{ts,js}'],
  synchronize: false
});
