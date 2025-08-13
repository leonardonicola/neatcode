import { Injectable } from "@nestjs/common";
import { PassportSerializer } from "@nestjs/passport";
import { AuthService } from "./auth.service";
import { SessionUser } from "@/@types/session";

@Injectable()
export class SessionSerializer extends PassportSerializer {
  constructor(private readonly authService: AuthService) {
    super();
  }

  serializeUser(
    user: SessionUser,
    done: (err: Error | null, user: unknown) => void,
  ): void {
    done(null, user.id);
  }

  async deserializeUser(
    userId: SessionUser["id"],
    done: (err: Error | null, user: SessionUser | null) => void,
  ): Promise<void> {
    try {
      const user = await this.authService.findUserById(userId);

      if (!user) {
        return done(null, null);
      }

      const sessionUser: SessionUser = {
        id: user.id,
        email: user.email,
        first_name: user.first_name,
        last_name: user.last_name,
      };

      done(null, sessionUser);
    } catch (error) {
      done(error as Error, null);
    }
  }
}
