import { Injectable, CanActivate, ExecutionContext } from "@nestjs/common";
import { Request } from "express";
import { SessionUser } from "../../../@types/session";

declare module "express-session" {
  interface SessionData {
    passport?: {
      user: SessionUser;
    };
  }
}

declare module "express" {
  interface Request {
    user?: SessionUser;
  }
}

@Injectable()
export class SessionAuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<Request>();
    return request.isAuthenticated();
  }
}
