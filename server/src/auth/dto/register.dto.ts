import { IsEmail, IsString, MinLength } from 'class-validator';

/* eslint-disable @typescript-eslint/no-unsafe-call */
export class RegisterDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;

  @IsString()
  @MinLength(2)
  name: string;
}
/* eslint-enable @typescript-eslint/no-unsafe-call */
