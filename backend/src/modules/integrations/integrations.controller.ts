import { Controller, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UserRole } from '@prisma/client';
import { ReqUser } from '../../common/decorators/current-user.decorator';
import { Roles } from '../../common/decorators/roles.decorator';
import { RolesGuard } from '../../common/guards/roles.guard';
import { CurrentUser } from '../../common/interfaces/current-user.interface';
import { IntegrationsService } from './integrations.service';

@Controller('integrations')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class IntegrationsController {
  constructor(private readonly integrationsService: IntegrationsService) {}

  @Post('bank/sync')
  @Roles(UserRole.ADMIN, UserRole.ACCOUNTANT)
  syncBank(@ReqUser() user: CurrentUser) {
    return this.integrationsService.syncBank(user);
  }

  @Post('ecommerce/shopee/sync')
  @Roles(UserRole.ADMIN, UserRole.ACCOUNTANT)
  syncShopee(@ReqUser() user: CurrentUser) {
    return this.integrationsService.syncShopee(user);
  }

  @Post('ecommerce/tokopedia/sync')
  @Roles(UserRole.ADMIN, UserRole.ACCOUNTANT)
  syncTokopedia(@ReqUser() user: CurrentUser) {
    return this.integrationsService.syncTokopedia(user);
  }
}
