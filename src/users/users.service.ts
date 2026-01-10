import { Injectable } from '@nestjs/common';
import { eq } from 'drizzle-orm';
import { DrizzleService } from 'src/database/drizzle.service';
import { usersTable } from 'src/database/schemas/users';

@Injectable()
export class UsersService {
  constructor(private readonly drizzleService: DrizzleService) {}

  create(email: string, password: string, firstName: string, lastName: string) {
    return this.drizzleService.db
      .insert(usersTable)
      .values({ email, password, firstName, lastName });
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
