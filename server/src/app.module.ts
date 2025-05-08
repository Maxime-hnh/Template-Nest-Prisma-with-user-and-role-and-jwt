import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { RolesModule } from './modules/roles/roles.module';
import { PrismaModule } from './modules/prisma/prisma.module';
import { UserController } from './modules/users/user.controller';
import { UsersController } from './modules/users/users.controller';


@Module({
  imports: [
    ConfigModule.forRoot({isGlobal:true}),
    UsersModule,
    RolesModule,
    AuthModule,
    PrismaModule
  ],
  controllers: [AppController, UserController, UsersController],
  providers: [AppService],
})
export class AppModule { }
