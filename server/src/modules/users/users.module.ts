import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { UserController } from './user.controller';

@Module({
  imports: [
    PrismaModule
  ],
  providers: [UsersService],
  controllers: [UsersController, UserController],
  exports: [UsersService], 
})
export class UsersModule { }
