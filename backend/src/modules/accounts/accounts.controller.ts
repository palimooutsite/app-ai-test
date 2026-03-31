import { Body, Controller, Delete, Get, Param, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UserRole } from '@prisma/client';
import { ReqUser } from '../../common/decorators/current-user.decorator';
import { Roles } from '../../common/decorators/roles.decorator';
import { RolesGuard } from '../../common/guards/roles.guard';
import { CurrentUser } from '../../common/interfaces/current-user.interface';
import { CreateAccountDto } from './dto/create-account.dto';
import { AccountsService } from './accounts.service';

@Controller('accounts')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class AccountsController {
  constructor(private readonly accountsService: AccountsService) {}

  @Post()
  @Roles(UserRole.ADMIN, UserRole.ACCOUNTANT)
  create(@ReqUser() user: CurrentUser, @Body() dto: CreateAccountDto) {
    return this.accountsService.create(user, dto);
  }

  @Get()
  @Roles(UserRole.ADMIN, UserRole.ACCOUNTANT, UserRole.OWNER)
  list(@ReqUser() user: CurrentUser) {
    return this.accountsService.list(user);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  deactivate(@ReqUser() user: CurrentUser, @Param('id') id: string) {
    return this.accountsService.deactivate(user, id);
  }
}
