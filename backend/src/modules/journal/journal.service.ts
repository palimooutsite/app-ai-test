import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { CurrentUser } from '../../common/interfaces/current-user.interface';
import { Account, JournalEntry, JournalLine } from '../../database/entities';
import { CreateJournalEntryDto } from './dto/create-journal-entry.dto';

@Injectable()
export class JournalService {
  constructor(
    @InjectRepository(Account)
    private readonly accountsRepository: Repository<Account>,
    @InjectRepository(JournalEntry)
    private readonly journalEntriesRepository: Repository<JournalEntry>,
    @InjectRepository(JournalLine)
    private readonly journalLinesRepository: Repository<JournalLine>
  ) {}

  async create(currentUser: CurrentUser, dto: CreateJournalEntryDto) {
    const debitTotal = dto.lines.reduce((sum, line) => sum + line.debit, 0);
    const creditTotal = dto.lines.reduce((sum, line) => sum + line.credit, 0);

    if (debitTotal <= 0 || creditTotal <= 0 || debitTotal !== creditTotal) {
      throw new BadRequestException('Double-entry validation failed: total debit must equal total credit');
    }

    const accountIds = dto.lines.map((line) => line.accountId);
    const validCount = await this.accountsRepository.count({
      where: {
        id: In(accountIds),
        companyId: currentUser.companyId,
        isActive: true
      }
    });

    if (validCount !== accountIds.length) {
      throw new BadRequestException('One or more accounts are invalid for this tenant');
    }

    const savedEntry = await this.journalEntriesRepository.save(
      this.journalEntriesRepository.create({
        companyId: currentUser.companyId,
        referenceNo: dto.referenceNo,
        description: dto.description,
        entryDate: new Date(dto.entryDate),
        createdById: currentUser.sub
      })
    );

    await this.journalLinesRepository.save(
      dto.lines.map((line) =>
        this.journalLinesRepository.create({
          journalEntryId: savedEntry.id,
          accountId: line.accountId,
          debit: line.debit.toFixed(2),
          credit: line.credit.toFixed(2),
          memo: line.memo ?? null
        })
      )
    );

    return this.journalEntriesRepository.findOneOrFail({
      where: { id: savedEntry.id },
      relations: { lines: true }
    });
  }

  async list(currentUser: CurrentUser) {
    return this.journalEntriesRepository.find({
      where: { companyId: currentUser.companyId },
      relations: {
        lines: { account: true },
        createdBy: true
      },
      select: {
        createdBy: {
          id: true,
          fullName: true,
          email: true
        }
      },
      order: {
        entryDate: 'DESC',
        createdAt: 'DESC'
      }
    });
  }
}
