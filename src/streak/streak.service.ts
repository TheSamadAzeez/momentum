import { Injectable, NotFoundException } from '@nestjs/common';
import { DrizzleService } from 'src/database/drizzle.service';
import { streaksTable } from 'src/database/schemas/streaks';
import { and, eq } from 'drizzle-orm';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class StreakService {
  constructor(
    private readonly drizzleService: DrizzleService,
    private readonly usersService: UsersService,
  ) {}

  /**
   * Helper method to calculate the difference in days between two dates
   * Both dates are normalized to 00:00:00 for accurate day comparison
   * Private means this method can only be called from within this class
   * @param date1
   * @param date2
   * @returns number of days between date1 and date2
   */
  private getDaysDifference(date1: Date, date2: Date): number {
    const d1 = new Date(date1);
    d1.setHours(0, 0, 0, 0);
    const d2 = new Date(date2);
    d2.setHours(0, 0, 0, 0);
    return Math.floor((d1.getTime() - d2.getTime()) / (1000 * 60 * 60 * 24));
  }

  async getUserStreak(userId: string) {
    const user = await this.usersService.findOneById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return {
      status: 'success',
      message: 'User streak found',
      data: user.data,
    };
  }

  async getHabitStreak(userId: string, habitId: string) {
    const streak = await this.drizzleService.db.query.streaksTable.findFirst({
      where: and(
        eq(streaksTable.userId, userId),
        eq(streaksTable.habitId, habitId),
      ),
    });

    if (!streak) {
      return { status: 'error', message: 'User has no streak', data: null };
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

  async createStreak(userId: string, habitId: string) {
    // check if streak exists
    const existingStreak =
      await this.drizzleService.db.query.streaksTable.findFirst({
        where: and(
          eq(streaksTable.userId, userId),
          eq(streaksTable.habitId, habitId),
        ),
      });

    // if streak exists, return error
    if (existingStreak) {
      return {
        status: 'error',
        message: 'Streak already exists',
        data: existingStreak,
      };
    }

    // if streak does not exist, create it
    await this.drizzleService.db.insert(streaksTable).values({
      userId,
      habitId,
      currentStreak: 1,
      longestStreak: 1,
      lastCompletionDate: new Date(),
      streakStartDate: new Date(),
    });

    // fetch the created streak
    const createdStreak =
      await this.drizzleService.db.query.streaksTable.findFirst({
        where: and(
          eq(streaksTable.userId, userId),
          eq(streaksTable.habitId, habitId),
        ),
      });

    return {
      status: 'success',
      message: 'Streak created',
      data: createdStreak!,
    };
  }

  async updateStreak(userId: string, habitId: string) {
    const response = await this.getHabitStreak(userId, habitId);

    if (!response.data) {
      // throw new NotFoundException('Streak not found');
      return await this.createStreak(userId, habitId);
    }

    const streakData = response.data;
    const today = new Date();

    // Use helper method to calculate days difference
    const daysDifference = this.getDaysDifference(
      today,
      streakData.lastCompletionDate,
    );

    let newCurrentStreak: number;
    let shouldUpdate = true;
    let updateStreakStartDate = false;

    if (daysDifference === 0) {
      // Last completion was today, leave streak as is
      shouldUpdate = false;
      newCurrentStreak = streakData.currentStreak;
    } else if (daysDifference === 1) {
      // Last completion was yesterday, increment streak by 1
      newCurrentStreak = streakData.currentStreak + 1;
    } else {
      // Last completion was 2+ days ago, start fresh
      // The cron job should have already reset this to 0, but we set to 1 now
      newCurrentStreak = 1;
      updateStreakStartDate = true; // Reset streak start date
    }

    if (!shouldUpdate) {
      return {
        status: 'success',
        message: 'Habit already completed today',
        data: {
          currentStreak: newCurrentStreak,
          longestStreak: streakData.longestStreak,
        },
      };
    }

    const newLongestStreak = Math.max(
      streakData.longestStreak,
      newCurrentStreak,
    );

    const updateData: {
      currentStreak: number;
      longestStreak: number;
      lastCompletionDate: Date;
      updatedAt: Date;
      streakStartDate?: Date;
    } = {
      currentStreak: newCurrentStreak,
      longestStreak: newLongestStreak,
      lastCompletionDate: today,
      updatedAt: new Date(),
    };

    // Update streak start date when starting fresh
    if (updateStreakStartDate) {
      updateData.streakStartDate = today;
    }

    await this.drizzleService.db
      .update(streaksTable)
      .set(updateData)
      .where(
        and(eq(streaksTable.userId, userId), eq(streaksTable.habitId, habitId)),
      );

    return {
      status: 'success',
      message:
        daysDifference === 1
          ? 'Streak continued! Keep it up!'
          : 'Starting fresh! New streak begun.',
      data: {
        currentStreak: newCurrentStreak,
        longestStreak: newLongestStreak,
        daysDifference,
      },
    };
  }

  // reset streak to 0 if streak is broken
  async resetStreak(userId: string, habitId: string) {
    await this.drizzleService.db
      .update(streaksTable)
      .set({
        currentStreak: 0,
      })
      .where(
        and(eq(streaksTable.userId, userId), eq(streaksTable.habitId, habitId)),
      );

    return { message: 'Streak reset successfully' };
  }
}
