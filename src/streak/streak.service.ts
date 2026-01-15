import { Injectable, NotFoundException } from '@nestjs/common';
import { DrizzleService } from 'src/database/drizzle.service';
import { streaksTable } from 'src/database/schemas/streaks';
import { and, eq } from 'drizzle-orm';

@Injectable()
export class StreakService {
  constructor(private readonly drizzleService: DrizzleService) {}

  async getHabitStreak(userId: string, habitId: string) {
    const streak = await this.drizzleService.db.query.streaksTable.findFirst({
      where: and(
        eq(streaksTable.userId, userId),
        eq(streaksTable.habitId, habitId),
      ),
    });

    if (!streak) {
      throw new NotFoundException('Streak not found');
    }

    return { status: 'success', message: 'Streak found', data: streak };
  }

  async getAllStreaks(userId: string) {
    const streaks = await this.drizzleService.db
      .select()
      .from(streaksTable)
      .where(eq(streaksTable.userId, userId));

    return { status: 'success', message: 'Streaks found', data: streaks };
  }

  // TODO: come back to this logic
  async createStreak(userId: string, habitId: string) {
    const existingStreak =
      await this.drizzleService.db.query.streaksTable.findFirst({
        where: and(
          eq(streaksTable.userId, userId),
          eq(streaksTable.habitId, habitId),
        ),
      });

    if (existingStreak) {
      return {
        status: 'error',
        message: 'Streak already exists',
      };
    }

    await this.drizzleService.db.insert(streaksTable).values({
      userId,
      habitId,
      currentStreak: 0,
      longestStreak: 0,
    });

    return {
      status: 'success',
      message: 'Streak created',
    };
  }

  async updateStreak(
    userId: string,
    habitId: string,
    currentStreak: number,
    longestStreak?: number,
  ) {
    const streak = await this.getHabitStreak(userId, habitId);

    const updatedLongestStreak =
      longestStreak ?? Math.max(streak?.data?.longestStreak, currentStreak);

    await this.drizzleService.db
      .update(streaksTable)
      .set({
        currentStreak,
        longestStreak: updatedLongestStreak,
        lastCompletionDate: new Date(),
        updatedAt: new Date(),
      })
      .where(
        and(eq(streaksTable.userId, userId), eq(streaksTable.habitId, habitId)),
      );

    return { status: 'success', message: 'Streak updated successfully' };
  }

  async incrementStreak(userId: string, habitId: string) {
    const streak = await this.getHabitStreak(userId, habitId);
    const newCurrentStreak = streak?.data?.currentStreak + 1;
    const newLongestStreak = Math.max(
      streak?.data?.longestStreak,
      newCurrentStreak,
    );

    await this.drizzleService.db
      .update(streaksTable)
      .set({
        currentStreak: newCurrentStreak,
        longestStreak: newLongestStreak,
        lastCompletionDate: new Date(),
        updatedAt: new Date(),
      })
      .where(
        and(eq(streaksTable.userId, userId), eq(streaksTable.habitId, habitId)),
      );

    return {
      currentStreak: newCurrentStreak,
      longestStreak: newLongestStreak,
    };
  }

  async resetStreak(userId: string, habitId: string) {
    await this.drizzleService.db
      .update(streaksTable)
      .set({
        currentStreak: 0,
        streakStartDate: new Date(),
        updatedAt: new Date(),
      })
      .where(
        and(eq(streaksTable.userId, userId), eq(streaksTable.habitId, habitId)),
      );

    return { message: 'Streak reset successfully' };
  }
}
