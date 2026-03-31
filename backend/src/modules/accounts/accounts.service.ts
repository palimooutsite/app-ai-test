import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CurrentUser } from '../../common/interfaces/current-user.interface';
import { Account, JournalLine } from '../../database/entities';
import { CreateAccountDto } from './dto/create-account.dto';

@Injectable()
export class AccountsService {
  constructor(
    @InjectRepository(Account)
    private readonly accountsRepository: Repository<Account>,
    @InjectRepository(JournalLine)
    private readonly journalLinesRepository: Repository<JournalLine>
  ) {}

  async create(currentUser: CurrentUser, dto: CreateAccountDto) {
    return this.accountsRepository.save(
      this.accountsRepository.create({
        companyId: currentUser.companyId,
        ...dto
      })
    );
  }

  async list(currentUser: CurrentUser) {
    return this.accountsRepository.find({
      where: { companyId: currentUser.companyId, isActive: true },
      order: { code: 'ASC' }
    });
  }

  async deactivate(currentUser: CurrentUser, accountId: string) {
    const hasLines = await this.journalLinesRepository
      .createQueryBuilder('line')
      .innerJoin('line.journalEntry', 'entry')
      .where('line.accountId = :accountId', { accountId })
      .andWhere('entry.companyId = :companyId', { companyId: currentUser.companyId })
      .getCount();

    if (hasLines > 0) {
      throw new BadRequestException('Cannot deactivate account with journal lines');
    }

    await this.accountsRepository.update(
      { id: accountId, companyId: currentUser.companyId },
      { isActive: false }
    );

    return this.accountsRepository.findOneByOrFail({ id: accountId, companyId: currentUser.companyId });
  }
}
