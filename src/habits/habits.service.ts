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

    return { message: 'Habit created successfully' };
  }

  async getAllHabits(userId: string) {
    return await this.drizzleService.db
      .select()
      .from(habitsTable)
      .where(eq(habitsTable.userId, userId));
  }

  async getHabitById(habitId: string, userId: string) {
    const habit = await this.drizzleService.db.query.habitsTable.findFirst({
      where: and(eq(habitsTable.id, habitId), eq(habitsTable.userId, userId)),
    });

    if (!habit) {
      throw new NotFoundException('Habit not found');
    }

    return habit;
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

    return { message: 'Habit updated successfully' };
  }

  async deleteHabit(habitId: string, userId: string) {
    await this.drizzleService.db
      .delete(habitsTable)
      .where(and(eq(habitsTable.id, habitId), eq(habitsTable.userId, userId)));

    return { message: 'Habit deleted successfully' };
  }

  async completeHabit(habitId: string, userId: string) {
    // Verify the habit exists and belongs to the user
    const habit = await this.getHabitById(habitId, userId);

    if (!habit) {
      throw new NotFoundException('Habit not found');
    }

    await this.drizzleService.db.insert(habitLogTable).values({
      habitId: habit.id,
      completed: true,
    });

    await this.streakService.updateStreak(userId, habitId);
    return { message: 'Habit marked as completed' };
  }

  async getHabitLogs(habitId: string, userId: string) {
    const habit = await this.getHabitById(habitId, userId);

    if (!habit) {
      throw new NotFoundException('Habit not found');
    }

    return await this.drizzleService.db
      .select()
      .from(habitLogTable)
      .where(eq(habitLogTable.habitId, habitId));
  }
}
