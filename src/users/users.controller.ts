import {
  Body,
  Controller,
  Get,
  Post,
  Session,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiCookieAuth,
} from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dtos/create-user.dto';
import { UsersService } from './users.service';
import { AuthGuard } from 'src/guards/auth.guard';

interface SessionData {
  userId?: string;
}

@ApiTags('users')
@Controller('user')
export class UsersController {
  constructor(
    private authService: AuthService,
    private usersService: UsersService,
  ) {}

  @ApiOperation({ summary: 'Get current user profile' })
  @ApiResponse({
    status: 200,
    description: 'User profile retrieved successfully',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized - Not logged in' })
  @ApiCookieAuth('session')
  @Get()
  @UseGuards(AuthGuard)
  async findUser(@Session() session: SessionData) {
    return await this.usersService.findOneById(session.userId as string);
  }

  @ApiOperation({ summary: 'Register a new user' })
  @ApiBody({ type: CreateUserDto })
  @ApiResponse({ status: 201, description: 'User registered successfully' })
  @ApiResponse({
    status: 400,
    description: 'Invalid input or email already exists',
  })
  @Post('auth/signup')
  async signup(@Body() body: CreateUserDto, @Session() session: SessionData) {
    const result = await this.authService.signup(body.email, body.password);
    session.userId = result.data.id;
    return result;
  }

  @ApiOperation({ summary: 'Sign in an existing user' })
  @ApiBody({ type: CreateUserDto })
  @ApiResponse({ status: 200, description: 'User signed in successfully' })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  @Post('auth/signin')
  async signin(@Body() body: CreateUserDto, @Session() session: SessionData) {
    const result = await this.authService.signin(body.email, body.password);
    session.userId = result.data.id;
    return result;
  }

  @ApiOperation({ summary: 'Sign out current user' })
  @ApiResponse({ status: 200, description: 'User signed out successfully' })
  @ApiCookieAuth('session')
  @Post('auth/signout')
  signout(@Session() session: SessionData) {
    return this.authService.signout(session);
  }
}
