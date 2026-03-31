import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, Unique, UpdateDateColumn } from 'typeorm';
import { ConnectionProvider } from '../enums';
import { Company } from './company.entity';

@Entity('ExternalConnection')
@Unique(['companyId', 'provider'])
export class ExternalConnection {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  companyId!: string;

  @ManyToOne(() => Company, (company) => company.connections, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'companyId' })
  company!: Company;

  @Column({ type: 'enum', enum: ConnectionProvider })
  provider!: ConnectionProvider;

  @Column({ nullable: true })
  externalOrgId!: string | null;

  @Column()
  accessToken!: string;

  @Column({ nullable: true })
  refreshToken!: string | null;

  @Column({ type: 'jsonb', nullable: true })
  metadata!: Record<string, unknown> | null;

  @Column({ default: true })
  isActive!: boolean;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
