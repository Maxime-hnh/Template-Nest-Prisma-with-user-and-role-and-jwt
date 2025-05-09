import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { UsersService } from '../users/users.service';
import { UserDto } from '../users/dto';


@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly usersService: UsersService,
  ) { }


  async login(user: UserDto) {
    const payload = { id: user.id, email: user.email, role: user.role.name };
    const accessToken = this.jwtService.sign(payload, {
      secret: this.configService.get<string>('JWT_SECRET'),
      expiresIn: this.configService.get<string>('JWT_EXPIRES_IN'),
    });

    const refreshToken = this.jwtService.sign(payload, {
      secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
      expiresIn: this.configService.get<string>('JWT_REFRESH_EXPIRES_IN'),
    });

    await this.prisma.user.update({
      where: { id: user.id },
      data: { refreshToken },
    });

    return {
      id: user.id,
      email: user.email,
      role: user.role.name,
      accessToken,
      refreshToken
    };
  }

  async refreshToken(oldRefreshToken: string) {
      const decoded = this.jwtService.verify(oldRefreshToken, {
        secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
      });

      const user = await this.usersService.findById(decoded.id)

      if (!user || user.refreshToken !== oldRefreshToken) {
        throw new UnauthorizedException('Invalid refresh token');
      }
      return this.login(user);
  }
}
