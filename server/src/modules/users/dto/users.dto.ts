import { PartialType } from '@nestjs/mapped-types';
import { Type } from 'class-transformer';
import { IsEmail, IsNotEmpty, IsString, MinLength, IsInt, IsUUID, IsOptional, ValidateNested } from 'class-validator';
import { RoleDto } from 'src/modules/roles/roles.dto';

export class UserDto {

  @IsInt()
  @IsNotEmpty()
  id: number;

  @IsUUID()
  @IsNotEmpty()
  uid: string;

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

  @IsString()
  @IsOptional()
  refreshToken: string;

  @IsInt()
  roleId: number;

  @ValidateNested() // ✅ Vérifie que role est bien un objet valide
  @Type(() => RoleDto) // ✅ Transforme automatiquement l'objet en `RoleDto`
  role: RoleDto;
};


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

export class LoginUserDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(8)
  password: string;
}


export class PartialUserDto extends PartialType(CreateUserDto) { }
