import { IsString, IsArray, ValidateNested, IsOptional, IsNumber } from 'class-validator';
import { Type, Transform } from 'class-transformer';

class TransactionItemDto {
  @IsString()
  productId: string;

  @Transform(({ value }) => parseInt(value, 10))
  @IsNumber()
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
