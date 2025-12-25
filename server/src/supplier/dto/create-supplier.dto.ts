import { IsString, IsOptional, MinLength, IsEmail } from 'class-validator';

/* eslint-disable @typescript-eslint/no-unsafe-call */
export class CreateSupplierDto {
  @IsString()
  @MinLength(2)
  name: string;

  @IsString()
  @MinLength(5)
  phone: string;

  @IsString()
  @MinLength(5)
  address: string;

  @IsEmail()
  @IsOptional()
  email?: string;
}
/* eslint-enable @typescript-eslint/no-unsafe-call */
