import { BadRequestException, Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../database/prisma.service';
import { CurrentUser } from '../../common/interfaces/current-user.interface';
import { CreateJournalEntryDto } from './dto/create-journal-entry.dto';

@Injectable()
export class JournalService {
  constructor(private readonly prisma: PrismaService) {}

  async create(currentUser: CurrentUser, dto: CreateJournalEntryDto) {
    const debitTotal = dto.lines.reduce((sum, line) => sum + line.debit, 0);
    const creditTotal = dto.lines.reduce((sum, line) => sum + line.credit, 0);

    if (debitTotal <= 0 || creditTotal <= 0 || debitTotal !== creditTotal) {
      throw new BadRequestException('Double-entry validation failed: total debit must equal total credit');
    }

    const accountIds = dto.lines.map((line) => line.accountId);
    const validCount = await this.prisma.account.count({
      where: {
        id: { in: accountIds },
        companyId: currentUser.companyId,
        isActive: true
      }
    });

    if (validCount !== accountIds.length) {
      throw new BadRequestException('One or more accounts are invalid for this tenant');
    }

    return this.prisma.journalEntry.create({
      data: {
        companyId: currentUser.companyId,
        referenceNo: dto.referenceNo,
        description: dto.description,
        entryDate: new Date(dto.entryDate),
        createdById: currentUser.sub,
        lines: {
          create: dto.lines.map((line) => ({
            accountId: line.accountId,
            debit: new Prisma.Decimal(line.debit),
            credit: new Prisma.Decimal(line.credit),
            memo: line.memo
          }))
        }
      },
      include: { lines: true }
    });
  }

  async list(currentUser: CurrentUser) {
    return this.prisma.journalEntry.findMany({
      where: { companyId: currentUser.companyId },
      include: {
        lines: { include: { account: true } },
        createdBy: { select: { id: true, fullName: true, email: true } }
      },
      orderBy: [{ entryDate: 'desc' }, { createdAt: 'desc' }]
    });
  }
}
