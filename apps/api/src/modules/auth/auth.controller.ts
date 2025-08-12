import {
  Controller,
  Post,
  Get,
  Body,
  UseGuards,
  Request,
  Response,
  HttpCode,
  HttpStatus,
  Logger,
} from "@nestjs/common";
import type {
  Request as ExpressRequest,
  Response as ExpressResponse,
} from "express";
import { AuthService } from "./auth.service";
import { LocalAuthGuard } from "./guards/local.guard";
import { Public } from "./decorator";
import { SessionUser } from "../../@types/session";
import type { LoginDto, RegisterDto } from "./dtos/";

@Controller("auth")
export class AuthController {
  private readonly logger = new Logger(AuthController.name);
  constructor(private readonly authService: AuthService) {}

  @Public() // Mark as public route
  @Post("register")
  async register(@Body() registerDto: RegisterDto) {
    const user = await this.authService.register(registerDto);
    return {
      message: "User registered successfully",
      user,
    };
  }

  @Public()
  @UseGuards(LocalAuthGuard)
  @Post("login")
  @HttpCode(HttpStatus.OK)
  login(
    @Body() _loginDto: LoginDto,
    @Request() req: ExpressRequest & { user: SessionUser },
    @Response() res: ExpressResponse,
  ) {
    req.login(req.user, (err) => {
      if (err) return res.status(500).json({ message: "Login failed" });
      res.json({
        message: "Login successful",
        user: req.user,
        sessionId: req.sessionID,
      });
    });
  }

  @Post("logout")
  @HttpCode(HttpStatus.OK)
  logout(@Request() req: ExpressRequest, @Response() res: ExpressResponse) {
    req.logout((err) => {
      if (err) {
        return res.status(500).json({ message: "Logout failed" });
      }

      req.session.destroy((sessionErr) => {
        if (sessionErr) {
          return res.status(500).json({ message: "Session destroy failed" });
        }

        res.clearCookie("connect.sid"); // Default session cookie name
        res.json({ message: "Logout successful" });
      });
    });
  }

  @Get("profile")
  getProfile(@Request() req: ExpressRequest & { user: SessionUser }) {
    return {
      user: req.user,
    };
  }

  @Public()
  @Get("status")
  getStatus(@Request() req: ExpressRequest) {
    return {
      isAuthenticated: req.isAuthenticated(),
      user: req.user || null,
    };
  }
}
