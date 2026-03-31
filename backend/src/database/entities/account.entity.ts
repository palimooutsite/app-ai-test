import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn
} from 'typeorm';
import { AccountType } from '../enums';
import { Company } from './company.entity';
import { JournalLine } from './journal-line.entity';

@Entity('Account')
@Unique(['companyId', 'code'])
@Index(['companyId', 'type'])
export class Account {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  companyId!: string;

  @ManyToOne(() => Company, (company) => company.accounts, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'companyId' })
  company!: Company;

  @Column()
  code!: string;

  @Column()
  name!: string;

  @Column({ type: 'enum', enum: AccountType })
  type!: AccountType;

  @Column({ nullable: true })
  parentId!: string | null;

  @ManyToOne(() => Account, (account) => account.children, { nullable: true })
  @JoinColumn({ name: 'parentId' })
  parent!: Account | null;

  @OneToMany(() => Account, (account) => account.parent)
  children!: Account[];

  @Column({ default: true })
  isActive!: boolean;

  @OneToMany(() => JournalLine, (line) => line.account)
  journalLines!: JournalLine[];

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
