import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { Observable } from 'rxjs';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private readonly jwtService: JwtService,
  ) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const roles = this.reflector.get<string[]>('roles', context.getHandler());
    
    if (!roles) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = this.jwtService.decode(request.headers.authorization);

    if (!user || !user.role || !Array.isArray(user.role)) {
      return false;
    }

    const lowercaseRoles = roles.map(role => role.toLowerCase());
    const userRoles = user.role.map(role => role.toLowerCase());

    return lowercaseRoles.some((role) => userRoles.includes(role));
  }
}
