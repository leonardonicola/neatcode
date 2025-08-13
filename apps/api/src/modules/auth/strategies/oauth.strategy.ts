import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from "passport-oauth2";
import { AuthService } from "../auth.service";
import { SessionUser } from "@/@types/session";
import { ConfigService } from "@nestjs/config";
import { AppConfig, OAuth2Config } from "@/config/app";

@Injectable()
export class OAuth2Strategy extends PassportStrategy(Strategy, "oauth2") {
  constructor(
    private readonly authService: AuthService,
    private readonly config: ConfigService<AppConfig>,
  ) {
    const oauthEnv = config.getOrThrow<OAuth2Config>("oauth2");
    super({
      authorizationURL: oauthEnv.authUrl,
      clientID: oauthEnv.clientId,
      clientSecret: oauthEnv.clientSecret,
      tokenURL: oauthEnv.tokenUrl,
      callbackURL: oauthEnv.callbackUrl,
      scope: ["profile", "email"],
    });
  }

  async validate(
    _accessToken: string,
    _refreshToken: string,
    profile: SessionUser,
    _done: Function,
  ) {
    const user = await this.authService.validateOAuthLogin(profile);

    if (!user) {
      throw new UnauthorizedException("Invalid credentials");
    }

    return user;
  }
}
