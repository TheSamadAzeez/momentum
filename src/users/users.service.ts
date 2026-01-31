import { Injectable, NotFoundException } from '@nestjs/common';
import { eq } from 'drizzle-orm';
import { DrizzleService } from 'src/database/drizzle.service';
import { usersTable } from 'src/database/schemas/users';

@Injectable()
export class UsersService {
  constructor(private readonly drizzleService: DrizzleService) {}

  async create(email: string, password: string) {
    const result = await this.drizzleService.db
      .insert(usersTable)
      .values({ email, password })
      .returning();
    return {
      status: 'success',
      message: 'User created successfully',
      data: result[0],
    };
  }

  async findOneById(id: string) {
    const user = await this.drizzleService.db.query.usersTable.findFirst({
      where: eq(usersTable.id, id),
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return { status: 'success', message: 'User found', data: user };
  }

  async findOneByEmail(email: string) {
    const user = await this.drizzleService.db.query.usersTable.findFirst({
      where: eq(usersTable.email, email),
    });
    if (!user) {
      return null;
    }
    return { status: 'success', message: 'User found', data: user };
  }

  async findAll() {
    const users = await this.drizzleService.db.select().from(usersTable);
    return { status: 'success', message: 'Users found', data: users };
  }

  async delete(id: string) {
    const result = await this.drizzleService.db
      .delete(usersTable)
      .where(eq(usersTable.id, id));
    return {
      status: 'success',
      message: 'User deleted successfully',
      data: result,
    };
  }
}
