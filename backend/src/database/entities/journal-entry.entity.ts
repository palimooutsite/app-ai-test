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
import { JournalStatus } from '../enums';
import { Company } from './company.entity';
import { JournalLine } from './journal-line.entity';
import { User } from './user.entity';

@Entity('JournalEntry')
@Unique(['companyId', 'referenceNo'])
@Index(['companyId', 'entryDate'])
export class JournalEntry {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  companyId!: string;

  @ManyToOne(() => Company, (company) => company.entries, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'companyId' })
  company!: Company;

  @Column()
  referenceNo!: string;

  @Column()
  description!: string;

  @Column({ type: 'timestamp' })
  entryDate!: Date;

  @Column({ type: 'enum', enum: JournalStatus, default: JournalStatus.POSTED })
  status!: JournalStatus;

  @OneToMany(() => JournalLine, (line) => line.journalEntry, { cascade: ['insert'] })
  lines!: JournalLine[];

  @Column()
  createdById!: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'createdById' })
  createdBy!: User;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
