// auth/auth.module.ts
import { Module } from "@nestjs/common";
import { PassportModule } from "@nestjs/passport";
import { AuthService } from "./auth.service";
import { AuthController } from "./auth.controller";
import { LocalStrategy } from "./strategies/local.strategy";
import { SessionSerializer } from "./session.serializer";
import { ConfigModule } from "@nestjs/config";
import { OAuth2Strategy } from "./strategies/oauth.strategy";

@Module({
  imports: [PassportModule.register({ session: true }), ConfigModule],
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy, SessionSerializer, OAuth2Strategy],
})
export class AuthModule {}
