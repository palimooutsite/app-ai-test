import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UserRole } from '../../database/enums';
import { ReqUser } from '../../common/decorators/current-user.decorator';
import { Roles } from '../../common/decorators/roles.decorator';
import { RolesGuard } from '../../common/guards/roles.guard';
import { CurrentUser } from '../../common/interfaces/current-user.interface';
import { CreateJournalEntryDto } from './dto/create-journal-entry.dto';
import { JournalService } from './journal.service';

@Controller('journal-entries')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class JournalController {
  constructor(private readonly journalService: JournalService) {}

  @Post()
  @Roles(UserRole.ADMIN, UserRole.ACCOUNTANT)
  create(@ReqUser() user: CurrentUser, @Body() dto: CreateJournalEntryDto) {
    return this.journalService.create(user, dto);
  }

  @Get()
  @Roles(UserRole.ADMIN, UserRole.ACCOUNTANT, UserRole.OWNER)
  list(@ReqUser() user: CurrentUser) {
    return this.journalService.list(user);
  }
}
