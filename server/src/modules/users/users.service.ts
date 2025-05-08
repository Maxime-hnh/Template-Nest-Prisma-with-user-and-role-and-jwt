import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { User } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { UserWithRole } from './users.types';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto, PartialUserDto } from './dto/users.dto';

@Injectable()
export class UsersService {
  constructor(
    private readonly configService: ConfigService,
    private readonly prisma: PrismaService
  ) { }


  async create(data: CreateUserDto): Promise<UserWithRole | void> {
    const hashedPassword = await this.hashPassword(data.password)

    return await this.prisma.user.create({
      data: {
        ...data,
        password: hashedPassword
      },
      include: { role: true }
    });
  };

  async update(id: number, data: PartialUserDto): Promise<User | void> {
    return this.prisma.user.update({
      where: { id },
      data
    })
  };

  async findAll(): Promise<User[]> {
    return this.prisma.user.findMany();
  };

  async findById(id: number): Promise<UserWithRole | null> {
    return this.prisma.user.findUnique({
      where: { id },
      include: { role: true }
    });
  };


  async findByEmail(email: string): Promise<UserWithRole | null> {
    return this.prisma.user.findUnique({
      where: { email },
      include: { role: true }
    });
  };

  async hashPassword(password: string): Promise<string> {
    const saltRounds = this.configService.get<number>('SALT_ROUNDS');
    return await bcrypt.hash(password, +saltRounds!);
  };

  async validPassword(password: string, user: User): Promise<boolean> {
    return bcrypt.compare(password, user.password);
  };

}
