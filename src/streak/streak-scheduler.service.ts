import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { DrizzleService } from 'src/database/drizzle.service';
import { streaksTable } from 'src/database/schemas/streaks';
import { eq } from 'drizzle-orm';

@Injectable()
export class StreakSchedulerService {
  private readonly logger = new Logger(StreakSchedulerService.name);

  constructor(private readonly drizzleService: DrizzleService) {}

  /**
   * Cron job that runs daily at 00:00 (midnight)
   * Resets streaks that have been broken (lastCompletionDate is 2+ days ago)
   */
  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async resetBrokenStreaks() {
    this.logger.log('Running daily streak reset job at midnight...');

    try {
      // Fetch all streaks
      const allStreaks = await this.drizzleService.db
        .select()
        .from(streaksTable);

      // Get today's date at 00:00:00
      // for example if today is 2026-01-16 10:02:43, then today will be 2026-01-16 00:00:00
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      let resetCount = 0;

      // Check each streak
      for (const streak of allStreaks) {
        // Get last completion date at 00:00:00
        const lastCompletion = new Date(streak.lastCompletionDate);
        lastCompletion.setHours(0, 0, 0, 0);

        // Calculate days difference
        const daysDifference = Math.floor(
          (today.getTime() - lastCompletion.getTime()) / (1000 * 60 * 60 * 24),
        );

        // Only reset if lastCompletionDate is 2+ days ago (streak is broken)
        // If it's 1 day ago (yesterday), user still has today to maintain their streak
        if (daysDifference >= 2 && streak.currentStreak > 0) {
          await this.drizzleService.db
            .update(streaksTable)
            .set({
              currentStreak: 0,
              updatedAt: new Date(),
            })
            .where(eq(streaksTable.id, streak.id));

          resetCount++;
          this.logger.debug(
            `Reset streak for user ${streak.userId}, habit ${streak.habitId} (was ${streak.currentStreak}, last completion: ${daysDifference} days ago)`,
          );
        }
      }

      this.logger.log(
        `Streak reset job completed. Reset ${resetCount} out of ${allStreaks.length} streaks.`,
      );
    } catch (error) {
      this.logger.error('Error running streak reset job:', error);
    }
  }
}
