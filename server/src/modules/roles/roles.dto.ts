import { IsInt, IsString } from 'class-validator';

export class RoleDto {
  @IsInt()
  id: number;

  @IsString()
  name: string;
}
