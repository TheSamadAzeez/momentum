import { Injectable } from '@nestjs/common';
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

  findOne(id: string) {
    return this.drizzleService.db
      .select()
      .from(usersTable)
      .where(eq(usersTable.id, id));
  }

  findOneByEmail(email: string) {
    return this.drizzleService.db
      .select()
      .from(usersTable)
      .where(eq(usersTable.email, email));
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
