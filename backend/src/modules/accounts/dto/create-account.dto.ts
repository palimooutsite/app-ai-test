import { AccountType } from '@prisma/client';
import { IsEnum, IsOptional, IsString } from 'class-validator';

export class CreateAccountDto {
  @IsString()
  code!: string;

  @IsString()
  name!: string;

  @IsEnum(AccountType)
  type!: AccountType;

  @IsOptional()
  @IsString()
  parentId?: string;
}
