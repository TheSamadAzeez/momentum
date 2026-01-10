import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dtos/create-user.dto';

@Controller('users')
export class UsersController {
  constructor(private authService: AuthService) {}

  @Post('auth/signup')
  signup(@Body() body: CreateUserDto) {
    return this.authService.signup(
      body.email,
      body.password,
      body.firstName,
      body.lastName,
    );
  }

  @Post('auth/signin')
  signin(@Body() body: CreateUserDto) {
    return this.authService.signin(body.email, body.password);
  }
}
