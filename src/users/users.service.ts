import { Injectable } from '@nestjs/common';
import { DrizzleService } from 'src/database/drizzle.service';

@Injectable()
export class UsersService {
  constructor(private readonly drizzleService: DrizzleService) {}

  findOne(id: number) {
    console.log(`user id: ${id}`);
  }

  findOneByEmail(email: string) {
    console.log(`user email: ${email}`);
  }

  findAll() {
    console.log('all users');
  }

  delete(id: number) {
    console.log(`deleted user with id: ${id}`);
  }
}
