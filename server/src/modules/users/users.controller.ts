import { Body, Controller, ForbiddenException, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from '@prisma/client';
import { JwtAuthGuard } from '../auth/auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { CurrentUser } from '../auth/current-user.decorator';
import { CreateUserDto, PartialUserDto, UserDto } from './dto';


@Controller('users')
export class UsersController {

  constructor(private readonly usersService: UsersService) { }


  @Post()
  async create(@Body() body: CreateUserDto): Promise<UserDto> {
    return await this.usersService.create(body);
  };

  @Get(':id')
  async getById(@Param('id') id: number): Promise<UserDto> {
    return await this.usersService.findByIdOrThrow(+id);
  };

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  async update(
    @Param('id') id: number,
    @Body() body: PartialUserDto,
    @CurrentUser() user: User
  ): Promise<UserDto> {
    if (user.id !== +id) throw new ForbiddenException()
    return this.usersService.update(+id, body);
  };


  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RoleName.SUPERADMIN)
  @Get('all')
  async getAll(): Promise<UserDto[] | void> {
    return this.usersService.findAll();
  };
}
