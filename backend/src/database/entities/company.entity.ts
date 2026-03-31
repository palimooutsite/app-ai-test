import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { Account } from './account.entity';
import { BankTransaction } from './bank-transaction.entity';
import { ExternalConnection } from './external-connection.entity';
import { JournalEntry } from './journal-entry.entity';
import { User } from './user.entity';

@Entity('Company')
export class Company {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  name!: string;

  @Column({ unique: true, nullable: true })
  taxId!: string | null;

  @Column({ default: 'IDR' })
  baseCurrency!: string;

  @OneToMany(() => User, (user) => user.company)
  users!: User[];

  @OneToMany(() => Account, (account) => account.company)
  accounts!: Account[];

  @OneToMany(() => JournalEntry, (entry) => entry.company)
  entries!: JournalEntry[];

  @OneToMany(() => BankTransaction, (txn) => txn.company)
  bankTxns!: BankTransaction[];

  @OneToMany(() => ExternalConnection, (conn) => conn.company)
  connections!: ExternalConnection[];

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
