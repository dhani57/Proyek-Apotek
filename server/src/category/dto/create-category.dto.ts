import { IsString, IsOptional, MinLength } from 'class-validator';

/* eslint-disable @typescript-eslint/no-unsafe-call */
export class CreateCategoryDto {
  @IsString()
  @MinLength(2)
  name: string;

  @IsString()
  @IsOptional()
  description?: string;
}
/* eslint-enable @typescript-eslint/no-unsafe-call */
