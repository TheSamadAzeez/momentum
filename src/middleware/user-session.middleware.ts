import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { UsersService } from 'src/users/users.service';

interface SessionData {
  userId?: string;
}
// extend the Request type to include the session and user properties
declare module 'express' {
  interface Request {
    session?: SessionData;
    user?: any;
  }
}

// middleware to check if user is authenticated and set user in request
@Injectable()
export class UserSessionMiddleware implements NestMiddleware {
  constructor(private usersService: UsersService) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const userId = req.session?.userId;
    if (userId) {
      req.user = await this.usersService.findOneById(userId);
    }
    next();
  }
}
