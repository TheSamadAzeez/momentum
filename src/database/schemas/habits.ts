import {
  pgTable,
  pgEnum,
  uuid,
  text,
  integer,
  boolean,
  timestamp,
} from 'drizzle-orm/pg-core';
import { usersTable } from './users';

// Enum for frequency types
export const frequencyTypeEnum = pgEnum('frequency_type', [
  'daily',
  'interval',
  'custom',
]);

// Enum for days of the week (for custom scheduling)
export const weekdayEnum = pgEnum('weekday', [
  'monday',
  'tuesday',
  'wednesday',
  'thursday',
  'friday',
  'saturday',
  'sunday',
]);

export const habitsTable = pgTable('habits', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id')
    .notNull()
    .references(() => usersTable.id, { onDelete: 'cascade' }),
  title: text('title').notNull(),
  description: text('description'),
  // Use enum for frequency type
  frequencyType: frequencyTypeEnum('frequency_type').notNull(),
  // Number of days between habit occurrences (for interval type)
  intervalDays: integer('interval_days'),
  // Array of weekdays for custom scheduling (e.g., ['monday', 'wednesday', 'friday'])
  customDays: text('custom_days').array(),
  // Array of reminder times in HH:MM format (e.g., ['08:00', '12:00', '18:00'])
  reminderTimes: text('reminder_times').array(),
  isActive: boolean('is_active').notNull().default(true),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});
