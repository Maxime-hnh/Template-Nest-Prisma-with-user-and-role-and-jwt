import { IsEmail, IsNotEmpty, IsString, MinLength, IsInt } from 'class-validator';

export class CreateUserDto {

  @IsString()
  @IsNotEmpty()
  firstName: string;

  @IsString()
  @IsNotEmpty()
  lastName: string;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(8)
  password: string;

  @IsInt()
  roleId: number;
};
