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
    const result = await this.usersService.create(email, hashedPassword);

    return result;
  }

  async signin(email: string, password: string) {
    // Find the user by email
    const user = await this.usersService.findOneByEmail(email);

    if (!user || !user.data) {
      throw new BadRequestException('Invalid email or password');
    }

    // Compare the provided password with the hashed password in the database
    const isPasswordValid = await bcrypt.compare(password, user.data.password);

    if (!isPasswordValid) {
      throw new BadRequestException('Invalid email or password');
    }

    return {
      status: 'success',
      message: 'User signed in successfully',
      data: user.data,
    };
  }

  signout(session: SessionData) {
    if (!session.userId) {
      throw new BadRequestException('User not found');
    }
    delete session.userId;
    return { status: 'success', message: 'User signed out successfully' };
  }
}
