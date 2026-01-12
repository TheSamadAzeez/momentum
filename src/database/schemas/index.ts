import { usersTable } from './users';
import { habitsTable } from './habits';

export const databaseSchema = {
  usersTable,
  habitsTable,
};

// export type createUserType = typeof usersTable.$inferInsert;
