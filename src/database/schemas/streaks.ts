import { pgTable, uuid, timestamp } from 'drizzle-orm/pg-core';
import { habitsTable } from './habits';
import { usersTable } from './users';
import { integer } from 'drizzle-orm/pg-core';

export const streaksTable = pgTable('streaks', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id')
    .notNull()
    .references(() => usersTable.id),
  habitId: uuid('habit_id')
    .notNull()
    .references(() => habitsTable.id),
  currentStreak: integer('current_streak').notNull().default(0),
  longestStreak: integer('longest_streak').notNull().default(0),
  lastCompletionDate: timestamp('last_completion_date').defaultNow().notNull(),
  streakStartDate: timestamp('streak_start_date').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});
