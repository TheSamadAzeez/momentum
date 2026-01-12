import { Injectable, NotFoundException } from '@nestjs/common';
import { DrizzleService } from 'src/database/drizzle.service';
import { and, eq } from 'drizzle-orm';
import { habitsTable } from 'src/database/schemas/habits';
import { createHabitDTO } from './dtos/create-habit.dto';

@Injectable()
export class HabitsService {
  constructor(private readonly drizzleService: DrizzleService) {}

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

  async getHabitById(id: string, userId: string) {
    const habit = await this.drizzleService.db.query.habitsTable.findFirst({
      where: and(eq(habitsTable.id, id), eq(habitsTable.userId, userId)),
    });

    if (!habit) {
      throw new NotFoundException('Habit not found');
    }

    return habit;
  }

  async updateHabit(id: string, userId: string, habitData: createHabitDTO) {
    await this.drizzleService.db
      .update(habitsTable)
      .set(habitData)
      .where(and(eq(habitsTable.id, id), eq(habitsTable.userId, userId)));

    return { message: 'Habit updated successfully' };
  }

  async deleteHabit(id: string, userId: string) {
    await this.drizzleService.db
      .delete(habitsTable)
      .where(and(eq(habitsTable.id, id), eq(habitsTable.userId, userId)));

    return { message: 'Habit deleted successfully' };
  }
}
