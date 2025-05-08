import { IsEmail, IsInt, IsNotEmpty, IsString } from "class-validator";

export class PayloadDto {

  @IsInt()
  @IsNotEmpty()
  id: number;

  @IsEmail()
  email: string;
  @IsString()
  @IsNotEmpty()
  role: string;

  @IsInt()
  @IsNotEmpty()
  iat: number;

  @IsInt()
  @IsNotEmpty()
  exp: number;
};
