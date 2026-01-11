import {
  Body,
  Controller,
  Get,
  Post,
  Session,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dtos/create-user.dto';
import { UsersService } from './users.service';
import { AuthGuard } from 'src/guards/auth.guard';

interface SessionData {
  userId?: string;
}

@Controller('user')
export class UsersController {
  constructor(
    private authService: AuthService,
    private usersService: UsersService,
  ) {}

  @Get()
  @UseGuards(AuthGuard)
  async findUser(@Session() session: SessionData) {
    return await this.usersService.findOneById(session.userId as string);
  }

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
