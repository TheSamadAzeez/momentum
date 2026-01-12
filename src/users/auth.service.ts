import { DrizzleService } from 'src/database/drizzle.service';
import { UsersService } from './users.service';
import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';

interface SessionData {
  userId?: number | string;
}
@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private readonly drizzle: DrizzleService,
  ) {}

  async signup(email: string, password: string) {
    // Check if user already exists
    const existingUser = await this.usersService.findOneByEmail(email);
    if (existingUser) {
      throw new ConflictException('User already exists');
    }

    // Hash the password with bcrypt using 10 salt rounds
    const hashedPassword: string = await bcrypt.hash(password, 10);

    // Create the user with the hashed password
    const newUser = await this.usersService.create(email, hashedPassword);

    return newUser;
  }

  async signin(email: string, password: string) {
    // Find the user by email
    const user = await this.usersService.findOneByEmail(email);

    if (!user) {
      throw new BadRequestException('Invalid email or password');
    }

    // Compare the provided password with the hashed password in the database
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new BadRequestException('Invalid email or password');
    }

    return user;
  }

  signout(session: SessionData) {
    if (!session.userId) {
      throw new BadRequestException('User not found');
    }
    delete session.userId;
  }
}
