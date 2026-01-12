import { usersTable } from './users';
import { habitsTable } from './habits';
import { habitLogTable } from './habit-log';

export const databaseSchema = {
  usersTable,
  habitsTable,
  habitLogTable,
};

// export type createUserType = typeof usersTable.$inferInsert;
