import { pgTable, uuid, boolean, timestamp } from 'drizzle-orm/pg-core';
import { habitsTable } from './habits';

export const habitLogTable = pgTable('habit_log', {
  id: uuid('id').primaryKey().defaultRandom(),
  habitId: uuid('habit_id')
    .notNull()
    .references(() => habitsTable.id),
  logDate: timestamp('log_date').defaultNow().notNull(),
  completed: boolean('completed').notNull().default(false),
  completedAt: timestamp('completed_at').defaultNow().notNull(),
});
