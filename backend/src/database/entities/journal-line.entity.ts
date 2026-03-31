import { Column, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Account } from './account.entity';
import { JournalEntry } from './journal-entry.entity';

@Entity('JournalLine')
@Index(['accountId'])
export class JournalLine {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  journalEntryId!: string;

  @ManyToOne(() => JournalEntry, (entry) => entry.lines, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'journalEntryId' })
  journalEntry!: JournalEntry;

  @Column()
  accountId!: string;

  @ManyToOne(() => Account, (account) => account.journalLines)
  @JoinColumn({ name: 'accountId' })
  account!: Account;

  @Column({ type: 'decimal', precision: 18, scale: 2 })
  debit!: string;

  @Column({ type: 'decimal', precision: 18, scale: 2 })
  credit!: string;

  @Column({ nullable: true })
  memo!: string | null;
}
