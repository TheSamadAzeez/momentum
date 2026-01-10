import { DrizzleService } from 'src/database/drizzle.service';
import { UsersService } from './users.service';
import { BadRequestException, Injectable } from '@nestjs/common';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private readonly drizzle: DrizzleService,
  ) {}

  async signup(
    email: string,
    password: string,
    firstName: string,
    lastName: string,
  ) {
    const user = await this.usersService.findOneByEmail(email);
    if (user.length > 1) {
      throw new BadRequestException('User already exists');
    }
    console.log(user, email, password, firstName, lastName);
  }

  signin(email: string, password: string) {
    console.log(email, password);
  }

  signout() {}
}
