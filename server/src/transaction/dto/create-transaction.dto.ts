import { IsString, IsArray, ValidateNested, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

class TransactionItemDto {
  @IsString()
  productId: string;

  @IsString()
  quantity: number;
}

export class CreateTransactionDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => TransactionItemDto)
  items: TransactionItemDto[];

  @IsString()
  paymentMethod: string;

  @IsString()
  @IsOptional()
  notes?: string;
}
