import { Injectable } from '@nestjs/common';
import { Role } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class RolesService {
  constructor(private readonly prisma: PrismaService) { }

  async create(data: { name: string }): Promise<Role> {
    return this.prisma.role.create({ data });
  }
}
