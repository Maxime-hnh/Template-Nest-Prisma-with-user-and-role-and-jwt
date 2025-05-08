import { Body, Controller, ForbiddenException, Get, NotFoundException, Param, Post, Put, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from '@prisma/client';
import { UserWithRole } from './users.types';
import { CreateUserDto, PartialUserDto } from './dto/users.dto';
import { JwtAuthGuard } from '../auth/auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';


@Controller('user')
export class UserController {

  constructor(private readonly usersService: UsersService) { }

  @Post()
  async create(@Body() body: CreateUserDto): Promise<UserWithRole | void> {
    return await this.usersService.create(body);
  };

  @Get(':id')
  async getById(@Param('id') id: number): Promise<UserWithRole | void> {
    const user = await this.usersService.findById(+id);
    if (!user) throw new NotFoundException(`user with id ${id} not found.`)
    return user;
  };

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  async update(
    @Param('id') id: number,
    @Body() body: PartialUserDto,
    @CurrentUser() user: User
  ): Promise<User | void> {
    if (user.id !== +id) throw new ForbiddenException()
    return this.usersService.update(+id, body);
  };

}
