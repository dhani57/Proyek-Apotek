import { IsEmail, IsString } from 'class-validator';

/* eslint-disable @typescript-eslint/no-unsafe-call */
export class LoginDto {
  @IsEmail()
  email: string;

  @IsString()
  password: string;
}
/* eslint-enable @typescript-eslint/no-unsafe-call */
