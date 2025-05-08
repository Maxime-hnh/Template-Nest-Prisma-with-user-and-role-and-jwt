import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';


//Security road : 3/3

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) { }

  canActivate(context: ExecutionContext): boolean {
    // Récupère les rôles définis dans les métadonnées de la route
    const requiredRoles = this.reflector.get<string[]>('roles', context.getHandler());

    if (!requiredRoles) {
      return true; // Si aucune restriction de rôle, tout le monde peut passer
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user; // Récupère l'utilisateur à partir du JWT (grâce à JwtAuthGuard)

    if (!user || !requiredRoles.includes(user.role)) {
      throw new ForbiddenException('Accès interdit');
    }

    return true;
  }
}
