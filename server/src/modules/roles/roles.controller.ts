import { Body, Controller, Post } from '@nestjs/common';
import { RolesService } from './roles.service';
import { Role } from '@prisma/client';

@Controller('roles')
export class RolesController {
  constructor(private readonly rolesService: RolesService) { }

  @Post()
  async create(@Body() body: { name: string }): Promise<Role | void> {
    return this.rolesService.create(body);
  }
}
