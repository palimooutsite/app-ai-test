import 'reflect-metadata';
import 'dotenv/config';
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
  host: process.env.DB_HOST,
  port: process.env.DB_PORT ? Number(process.env.DB_PORT) : undefined,
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: [Account, BankTransaction, Company, ExternalConnection, JournalEntry, JournalLine, User],
  migrations: ['src/database/migrations/*.{ts,js}'],
  synchronize: false
});
