import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UserRole } from '@prisma/client';
import { ReqUser } from '../../common/decorators/current-user.decorator';
import { Roles } from '../../common/decorators/roles.decorator';
import { RolesGuard } from '../../common/guards/roles.guard';
import { CurrentUser } from '../../common/interfaces/current-user.interface';
import { ReportsService } from './reports.service';

@Controller('reports')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Get('income-statement')
  @Roles(UserRole.ADMIN, UserRole.ACCOUNTANT, UserRole.OWNER)
  incomeStatement(@ReqUser() user: CurrentUser, @Query('from') from: string, @Query('to') to: string) {
    return this.reportsService.incomeStatement(user, new Date(from), new Date(to));
  }

  @Get('balance-sheet')
  @Roles(UserRole.ADMIN, UserRole.ACCOUNTANT, UserRole.OWNER)
  balanceSheet(@ReqUser() user: CurrentUser, @Query('asOf') asOf: string) {
    return this.reportsService.balanceSheet(user, new Date(asOf));
  }

  @Get('cash-flow')
  @Roles(UserRole.ADMIN, UserRole.ACCOUNTANT, UserRole.OWNER)
  cashFlow(@ReqUser() user: CurrentUser, @Query('from') from: string, @Query('to') to: string) {
    return this.reportsService.cashFlow(user, new Date(from), new Date(to));
  }
}
