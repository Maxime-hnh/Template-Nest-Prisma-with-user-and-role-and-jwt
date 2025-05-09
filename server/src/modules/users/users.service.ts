import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { User } from '@prisma/client';
import * as bcrypt from 'bcryptjs';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto, UpdateUserDto, UserDto } from './dto';
import { toDto } from 'src/utils/dto-transformer';
import { toDtos } from 'src/utils/dtos-transfomer';

@Injectable()
export class UsersService {
  constructor(
    private readonly configService: ConfigService,
    private readonly prisma: PrismaService
  ) { }


  async create(data: CreateUserDto): Promise<UserDto> {
    const hashedPassword = await this.hashPassword(data.password)

    const user = await this.prisma.user.create({
      data: {
        ...data,
        password: hashedPassword
      },
      include: { role: true }
    });
    return toDto(UserDto, user)
  };

  async update(id: number, data: UpdateUserDto): Promise<UserDto> {
    const user = await this.prisma.user.update({
      where: { id },
      data
    })
    return toDto(UserDto, user)
  };

  async findAll(): Promise<UserDto[]> {
    const users = await this.prisma.user.findMany();
    return toDtos(UserDto, users)
  };

  async findByIdOrThrow(id: number): Promise<UserDto> {
    const user = await this.prisma.user.findUniqueOrThrow({
      where: { id },
      include: { role: true }
    });
    return toDto(UserDto, user)
  };


  async findByEmail(email: string): Promise<UserDto> {
    const user = await this.prisma.user.findUnique({
      where: { email },
      include: { role: true }
    });
    return toDto(UserDto, user);
  };


  async hashPassword(password: string): Promise<string> {
    const saltRounds = this.configService.get<number>('SALT_ROUNDS');
    return await bcrypt.hash(password, +saltRounds!);
  };

  async validPassword(password: string, user: User): Promise<boolean> {
    return bcrypt.compare(password, user.password);
  };

}
