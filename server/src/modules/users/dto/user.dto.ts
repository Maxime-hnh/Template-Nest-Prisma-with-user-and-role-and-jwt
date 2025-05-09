import { Exclude, Expose, Type } from 'class-transformer';
import { IsEmail, IsNotEmpty, IsString, MinLength, IsInt, IsUUID, IsOptional, ValidateNested } from 'class-validator';
import { RoleDto } from 'src/modules/roles/roles.dto';

export class UserDto {

  @Expose()
  @IsInt()
  @IsNotEmpty()
  id: number;

  @Expose()
  @IsUUID()
  @IsNotEmpty()
  uid: string;

  @Expose()
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @Expose()
  @IsString()
  @IsNotEmpty()
  lastName: string;

  @Expose()
  @IsEmail()
  email: string;

  @Exclude()
  @IsString()
  @MinLength(8)
  password: string;

  @Expose()
  @IsString()
  @IsOptional()
  refreshToken: string;

  @Expose()
  @IsInt()
  roleId: number;

  @ValidateNested() // ✅ Vérifie que role est bien un objet valide
  @Type(() => RoleDto) // ✅ Transforme automatiquement l'objet en `RoleDto`
  role: RoleDto;
};