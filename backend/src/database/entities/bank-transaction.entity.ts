import { Column, CreateDateColumn, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn, Unique } from 'typeorm';
import { Company } from './company.entity';

@Entity('BankTransaction')
@Unique(['companyId', 'externalId'])
@Index(['companyId', 'txnDate'])
export class BankTransaction {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  companyId!: string;

  @ManyToOne(() => Company, (company) => company.bankTxns, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'companyId' })
  company!: Company;

  @Column()
  externalId!: string;

  @Column({ type: 'decimal', precision: 18, scale: 2 })
  amount!: string;

  @Column({ type: 'timestamp' })
  txnDate!: Date;

  @Column()
  description!: string;

  @Column({ nullable: true })
  reference!: string | null;

  @Column({ nullable: true })
  accountNumber!: string | null;

  @CreateDateColumn()
  createdAt!: Date;
}
