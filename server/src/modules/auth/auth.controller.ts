import { Controller, Post, Body, NotFoundException, Headers, UnauthorizedException, HttpCode } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { LoginUserDto } from '../users/dto/login-user.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService
  ) { }

  @Post('login')
  @HttpCode(200)
  async login(@Body() body: LoginUserDto) {
    const user = await this.usersService.findByEmail(body.email)
    if (!user) throw new NotFoundException(`user with email ${body.email} not found.`)
    const isValid = await this.usersService.validPassword(body.password, user)
    if (isValid) return this.authService.login(user)
  }

  @Post('refresh')
  @HttpCode(200)
  async refresh(@Headers('x-refresh-token') refreshToken: string) {
    if (!refreshToken) throw new UnauthorizedException('Refresh token is missing');
    return this.authService.refreshToken(refreshToken);
  }
}
