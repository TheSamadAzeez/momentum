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
    return result[0];
  }

  async findOneById(id: string) {
    const user = await this.drizzleService.db.query.usersTable.findFirst({
      where: eq(usersTable.id, id),
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  findOneByEmail(email: string) {
    return this.drizzleService.db.query.usersTable.findFirst({
      where: eq(usersTable.email, email),
    });
  }

  findAll() {
    return this.drizzleService.db.select().from(usersTable);
  }

  delete(id: string) {
    return this.drizzleService.db
      .delete(usersTable)
      .where(eq(usersTable.id, id));
  }
}
