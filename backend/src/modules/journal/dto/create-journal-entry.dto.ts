import { Type } from 'class-transformer';
import { IsArray, IsDateString, IsNumber, IsOptional, IsString, Min, ValidateNested } from 'class-validator';

class JournalLineDto {
  @IsString()
  accountId!: string;

  @IsNumber()
  @Min(0)
  debit!: number;

  @IsNumber()
  @Min(0)
  credit!: number;

  @IsOptional()
  @IsString()
  memo?: string;
}

export class CreateJournalEntryDto {
  @IsString()
  referenceNo!: string;

  @IsString()
  description!: string;

  @IsDateString()
  entryDate!: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => JournalLineDto)
  lines!: JournalLineDto[];
}
