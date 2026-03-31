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

const databaseUrl = process.env.DATABASE_URL;
const dbPort = process.env.DB_PORT ? Number(process.env.DB_PORT) : undefined;

export default new DataSource({
  type: 'postgres',
  ...(databaseUrl
    ? { url: databaseUrl }
    : {
        host: process.env.DB_HOST,
        port: dbPort,
        username: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME
      }),
  entities: [Account, BankTransaction, Company, ExternalConnection, JournalEntry, JournalLine, User],
  migrations: ['src/database/migrations/*.{ts,js}'],
  synchronize: false
});
