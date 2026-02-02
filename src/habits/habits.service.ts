import { Injectable, NotFoundException } from '@nestjs/common';
import { DrizzleService } from 'src/database/drizzle.service';
import { and, eq } from 'drizzle-orm';
import { habitsTable } from 'src/database/schemas/habits';
import { habitLogTable } from 'src/database/schemas/habit-log';
import { createHabitDTO } from './dtos/create-habit.dto';
import { StreakService } from 'src/streak/streak.service';

@Injectable()
export class HabitsService {
  constructor(
    private readonly drizzleService: DrizzleService,
    private readonly streakService: StreakService,
  ) {}

  async createHabit(userId: string, habitData: createHabitDTO) {
    await this.drizzleService.db.insert(habitsTable).values({
      ...habitData,
      userId,
    });

    return { status: 'success', message: 'Habit created successfully' };
  }

  async getAllHabits(userId: string) {
    const result = await this.drizzleService.db
      .select()
      .from(habitsTable)
      .where(eq(habitsTable.userId, userId));

    return { status: 'success', message: 'Habits found', data: result };
  }

  async getHabitById(habitId: string, userId: string) {
    const habit = await this.drizzleService.db.query.habitsTable.findFirst({
      where: and(eq(habitsTable.id, habitId), eq(habitsTable.userId, userId)),
    });

    if (!habit) {
      throw new NotFoundException('Habit not found');
    }

    return { status: 'success', message: 'Habit found', data: habit };
  }

  async updateHabit(
    habitId: string,
    userId: string,
    habitData: createHabitDTO,
  ) {
    await this.drizzleService.db
      .update(habitsTable)
      .set(habitData)
      .where(and(eq(habitsTable.id, habitId), eq(habitsTable.userId, userId)));

    return { status: 'success', message: 'Habit updated successfully' };
  }

  async deleteHabit(habitId: string, userId: string) {
    const habit = await this.getHabitById(habitId, userId);
    if (!habit) {
      throw new NotFoundException('Habit not found');
    }
    await this.drizzleService.db
      .delete(habitsTable)
      .where(and(eq(habitsTable.id, habitId), eq(habitsTable.userId, userId)));

    return { status: 'success', message: 'Habit deleted successfully' };
  }

  async completeHabit(habitId: string, userId: string) {
    // Verify the habit exists and belongs to the user
    const habit = await this.getHabitById(habitId, userId);

    if (!habit) {
      throw new NotFoundException('Habit not found');
    }

    await this.drizzleService.db.insert(habitLogTable).values({
      habitId: habit.data.id,
      completed: true,
    });

    // Update analytics: increment completions, reset consecutive misses
    const wasRecovering = habit.data.consecutiveMisses > 0;
    await this.drizzleService.db
      .update(habitsTable)
      .set({
        totalCompletions: habit.data.totalCompletions + 1,
        consecutiveMisses: 0,
        ...(wasRecovering && { lastRecoveryDate: new Date() }),
      })
      .where(and(eq(habitsTable.id, habitId), eq(habitsTable.userId, userId)));

    await this.streakService.updateStreak(userId, habitId);
    return { status: 'success', message: 'Habit marked as completed' };
  }

  async incrementMissedDay(habitId: string, userId: string) {
    const habit = await this.getHabitById(habitId, userId);

    if (!habit) {
      throw new NotFoundException('Habit not found');
    }

    await this.drizzleService.db
      .update(habitsTable)
      .set({
        totalMissedDays: habit.data.totalMissedDays + 1,
        consecutiveMisses: habit.data.consecutiveMisses + 1,
        lastMissedDate: new Date(),
      })
      .where(and(eq(habitsTable.id, habitId), eq(habitsTable.userId, userId)));

    return { status: 'success', message: 'Missed day tracked' };
  }

  async getHabitLogs(habitId: string, userId: string) {
    const habit = await this.getHabitById(habitId, userId);

    if (!habit) {
      throw new NotFoundException('Habit not found');
    }

    const result = await this.drizzleService.db
      .select()
      .from(habitLogTable)
      .where(eq(habitLogTable.habitId, habitId));

    return { status: 'success', message: 'Habit logs found', data: result };
  }
}
