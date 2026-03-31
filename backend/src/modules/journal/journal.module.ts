import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Account, JournalEntry, JournalLine } from '../../database/entities';
import { JournalController } from './journal.controller';
import { JournalService } from './journal.service';

@Module({
  imports: [TypeOrmModule.forFeature([Account, JournalEntry, JournalLine])],
  controllers: [JournalController],
  providers: [JournalService]
})
export class JournalModule {}
