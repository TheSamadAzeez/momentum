import { pgTable } from 'drizzle-orm/pg-core';
import { usersTable } from './users';
import { uuid } from 'drizzle-orm/pg-core';
import { habitsTable } from './habits';
import { text } from 'drizzle-orm/pg-core';
import { timestamp } from 'drizzle-orm/pg-core';

export const notificationsTable = pgTable('notifications', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id')
    .notNull()
    .references(() => usersTable.id),
  habitId: uuid('habit_id')
    .notNull()
    .references(() => habitsTable.id),
  channel: text('channel').notNull().default('email'),
  scheduledFor: timestamp('scheduled_for'),
  sentAt: timestamp('sent_at'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});
