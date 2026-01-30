import { usersTable } from './users';
import { habitsTable } from './habits';
import { habitLogTable } from './habit-log';
import { streaksTable } from './streaks';
import { notificationsTable } from './notifications';

export const databaseSchema = {
  usersTable,
  habitsTable,
  habitLogTable,
  streaksTable,
  notificationsTable,
};

// export type createUserType = typeof usersTable.$inferInsert;
