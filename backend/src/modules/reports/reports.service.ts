import { Injectable } from '@nestjs/common';
import { AccountType } from '@prisma/client';
import { PrismaService } from '../../database/prisma.service';
import { CurrentUser } from '../../common/interfaces/current-user.interface';

@Injectable()
export class ReportsService {
  constructor(private readonly prisma: PrismaService) {}

  async incomeStatement(currentUser: CurrentUser, from: Date, to: Date) {
    const lines = await this.fetchLines(currentUser.companyId, from, to);
    const revenues = this.sumByType(lines, AccountType.REVENUE);
    const expenses = this.sumByType(lines, AccountType.EXPENSE);

    return {
      period: { from, to },
      revenue: revenues,
      expense: expenses,
      netIncome: revenues - expenses
    };
  }

  async balanceSheet(currentUser: CurrentUser, asOf: Date) {
    const lines = await this.fetchLines(currentUser.companyId, new Date('1970-01-01'), asOf);

    return {
      asOf,
      assets: this.sumByType(lines, AccountType.ASSET),
      liabilities: this.sumByType(lines, AccountType.LIABILITY),
      equity: this.sumByType(lines, AccountType.EQUITY)
    };
  }

  async cashFlow(currentUser: CurrentUser, from: Date, to: Date) {
    const lines = await this.fetchLines(currentUser.companyId, from, to);
    const cashIn = lines
      .filter((line) => line.account.type === AccountType.ASSET && line.account.code.startsWith('1'))
      .reduce((sum, line) => sum + Number(line.debit), 0);

    const cashOut = lines
      .filter((line) => line.account.type === AccountType.ASSET && line.account.code.startsWith('1'))
      .reduce((sum, line) => sum + Number(line.credit), 0);

    return {
      period: { from, to },
      cashIn,
      cashOut,
      netCashFlow: cashIn - cashOut
    };
  }

  private async fetchLines(companyId: string, from: Date, to: Date) {
    return this.prisma.journalLine.findMany({
      where: {
        journalEntry: {
          companyId,
          entryDate: { gte: from, lte: to }
        }
      },
      include: { account: true }
    });
  }

  private sumByType(lines: Array<{ debit: unknown; credit: unknown; account: { type: AccountType } }>, type: AccountType) {
    return lines
      .filter((line) => line.account.type === type)
      .reduce((sum, line) => sum + Number(line.debit) - Number(line.credit), 0);
  }
}
