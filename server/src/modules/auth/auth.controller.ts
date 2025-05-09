import { Controller, Post, Body, Headers, UnauthorizedException, HttpCode } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { LoginUserDto } from '../users/dto/login-user.dto';
import { AuthDto } from './dto/auth.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService
  ) { }

  @Post('login')
  @HttpCode(200)
  async login(@Body() body: LoginUserDto): Promise<AuthDto> {
    const user = await this.usersService.findByEmail(body.email)
    const isValid = await this.usersService.validPassword(body.password, user)
    if (!isValid) throw new UnauthorizedException('Identifiants incorrects');
    return this.authService.login(user)
  }

  @Post('refresh')
  @HttpCode(200)
  async refresh(@Headers('x-refresh-token') refreshToken: string): Promise<AuthDto | void> {
    if (!refreshToken) throw new UnauthorizedException('Refresh token is missing');
    return this.authService.refreshToken(refreshToken);
  }
}
