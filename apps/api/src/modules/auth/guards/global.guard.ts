// auth/guards/global-auth.guard.ts
import { Injectable, CanActivate, ExecutionContext } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Request } from "express";
import { IS_PUBLIC_KEY } from "../decorator";

@Injectable()
export class GlobalAuthGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    // If route is marked as public, allow access
    if (isPublic) {
      return true;
    }

    // For protected routes, check authentication
    const request = context.switchToHttp().getRequest<Request>();
    return request.isAuthenticated();
  }
}
