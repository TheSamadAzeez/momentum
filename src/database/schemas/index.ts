import { usersTable } from './users';
import { habitsTable } from './habits';
import { habitLogTable } from './habit-log';
import { streaksTable } from './streaks';

export const databaseSchema = {
  usersTable,
  habitsTable,
  habitLogTable,
  streaksTable,
};

// export type createUserType = typeof usersTable.$inferInsert;
