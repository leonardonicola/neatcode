import {
  Injectable,
  UnauthorizedException,
  ConflictException,
  Inject,
} from "@nestjs/common";
import { Kysely } from "kysely";
import * as bcrypt from "bcrypt";
import { DB } from "kysely-codegen";
import { NewUser, SafeUser, User } from "../../@types/user";
import { v4 } from "uuid";
import { SessionUser } from "../../@types/session";
import { LoginDto, RegisterDto } from "./dtos";

@Injectable()
export class AuthService {
  constructor(@Inject("KYSELY_CONNECTION") private readonly db: Kysely<DB>) {}

  async register(registerDto: RegisterDto): Promise<SafeUser> {
    const { email, password, firstName, lastName } = registerDto;

    // Check if user already exists
    const existingUser = await this.db
      .selectFrom("users")
      .select("id")
      .where("email", "=", email)
      .executeTakeFirst();

    if (existingUser) {
      throw new ConflictException("User with this email already exists");
    }

    // Hash password
    const saltRounds = 12;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    // Create user
    const newUser: NewUser = {
      id: v4(),
      email,
      password_hash: passwordHash,
      first_name: firstName,
      last_name: lastName || null,
    };

    const user = await this.db
      .insertInto("users")
      .values(newUser)
      .returningAll()
      .executeTakeFirstOrThrow();

    return this.toSafeUser(user);
  }

  async validateUser(
    email: string,
    password: string,
  ): Promise<SessionUser | null> {
    const user = await this.db
      .selectFrom("users")
      .selectAll()
      .where("email", "=", email)
      .executeTakeFirst();

    if (!user) {
      return null;
    }

    const isPasswordValid = await bcrypt.compare(password, user.password_hash);

    if (!isPasswordValid) {
      return null;
    }

    return {
      id: user.id,
      email: user.email,
      first_name: user.first_name,
      last_name: user.last_name,
    };
  }

  async login(loginDto: LoginDto): Promise<SessionUser> {
    const { email, password } = loginDto;

    const user = await this.validateUser(email, password);

    if (!user) {
      throw new UnauthorizedException("Invalid credentials");
    }

    return user;
  }

  async findUserById(id: string): Promise<SafeUser | null> {
    const user = await this.db
      .selectFrom("users")
      .selectAll()
      .where("id", "=", id)
      .executeTakeFirst();

    if (!user) {
      return null;
    }

    return this.toSafeUser(user);
  }

  private toSafeUser(user: User): SafeUser {
    // eslint-disable-next-line
    const { password_hash, ...safeUser } = user;
    return safeUser;
  }
}
