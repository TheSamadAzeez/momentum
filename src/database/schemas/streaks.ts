import { pgTable, uuid, timestamp } from 'drizzle-orm/pg-core';
import { habitsTable } from './habits';
import { usersTable } from './users';
import { integer } from 'drizzle-orm/pg-core';

export const streaksTable = pgTable('streaks', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id')
    .notNull()
    .references(() => usersTable.id, { onDelete: 'cascade' }), // if user is deleted, delete all their streaks
  habitId: uuid('habit_id')
    .notNull()
    .references(() => habitsTable.id, { onDelete: 'cascade' }), // if habit is deleted, delete all its streaks
  currentStreak: integer('current_streak').notNull().default(0),
  longestStreak: integer('longest_streak').notNull().default(0),
  lastCompletionDate: timestamp('last_completion_date').notNull(),
  streakStartDate: timestamp('streak_start_date').notNull(),
  // Analytics fields
  totalResets: integer('total_resets').notNull().default(0),
  lastResetDate: timestamp('last_reset_date'),
  totalDaysTracked: integer('total_days_tracked').notNull().default(0),
  updatedAt: timestamp('updated_at')
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});
