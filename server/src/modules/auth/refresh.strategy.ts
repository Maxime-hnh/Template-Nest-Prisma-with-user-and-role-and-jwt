import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { Strategy } from 'passport-jwt';
import { PayloadDto } from './auth.dto';

@Injectable()
export class RefreshStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
  constructor(private readonly configService: ConfigService) {
    super({
      jwtFromRequest: (req: Request) => req.headers['x-refresh-token'] as string,
      secretOrKey: configService.get<string>('JWT_REFRESH_SECRET')!,
      passReqToCallback: true,
    });
  }

  async validate(req: Request, payload: PayloadDto) {
    const refreshToken = req.headers['x-refresh-token'];
    if (!refreshToken) {
      throw new UnauthorizedException();
    }
    return {
      id: payload.id,
      email: payload.email,
      role: payload.role,
    };
  }
}
