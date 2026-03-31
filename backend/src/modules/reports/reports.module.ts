import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JournalLine } from '../../database/entities';
import { ReportsController } from './reports.controller';
import { ReportsService } from './reports.service';

@Module({
  imports: [TypeOrmModule.forFeature([JournalLine])],
  controllers: [ReportsController],
  providers: [ReportsService]
})
export class ReportsModule {}
