import { Controller, Post, Body, Session } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dtos/create-user.dto';

interface SessionData {
  userId?: number | string;
}

@Controller('users')
export class UsersController {
  constructor(private authService: AuthService) {}

  @Post('auth/signup')
  async signup(@Body() body: CreateUserDto, @Session() session: SessionData) {
    const user = await this.authService.signup(body.email, body.password);
    session.userId = user?.id;
    return user;
  }

  @Post('auth/signin')
  async signin(@Body() body: CreateUserDto, @Session() session: SessionData) {
    const user = await this.authService.signin(body.email, body.password);
    session.userId = user?.id;
    return user;
  }

  @Post('auth/signout')
  signout(@Session() session: SessionData) {
    this.authService.signout(session);
    return { message: 'User signed out successfully' };
  }
}
