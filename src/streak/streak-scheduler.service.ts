import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { StreakService } from './streak.service';
import { StreakResetJobData } from './streak.processor';

@Injectable()
export class StreakSchedulerService {
  private readonly logger = new Logger(StreakSchedulerService.name);

  constructor(
    private readonly streakService: StreakService,
    @InjectQueue('streak') private readonly streakQueue: Queue,
  ) {}

  /**
   * Helper method to determine if a habit is due today based on its frequency type
   * @param frequencyType - The type of frequency (daily, interval, custom)
   * @param lastCompletionDate - The last date the habit was completed
   * @param intervalDays - Number of days between occurrences (for interval type)
   * @param customDays - Array of weekday names (for custom type)
   * @returns true if the habit should be checked today, false otherwise
   */
  private isHabitDueToday(
    frequencyType: 'daily' | 'interval' | 'custom',
    lastCompletionDate: Date,
    intervalDays: number | null,
    customDays: string[] | null,
  ): boolean {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    switch (frequencyType) {
      case 'daily':
        // Daily habits are checked every day
        return true;

      case 'interval': {
        if (!intervalDays || intervalDays < 2) {
          this.logger.warn(
            'Invalid intervalDays for interval habit, treating as daily',
          );
          return true;
        }

        // Calculate days since last completion
        const lastCompletion = new Date(lastCompletionDate);
        lastCompletion.setHours(0, 0, 0, 0);
        const daysSinceCompletion = Math.floor(
          (today.getTime() - lastCompletion.getTime()) / (1000 * 60 * 60 * 24),
        );

        // Check if today is a multiple of the interval
        // For example, if interval is 3 days:
        // - Day 1 (last completion): not due
        // - Day 2: not due
        // - Day 3: due
        // - Day 4: overdue (should reset if not completed on day 3)
        return daysSinceCompletion >= intervalDays;
      }

      case 'custom': {
        if (!customDays || customDays.length === 0) {
          this.logger.warn(
            'Invalid customDays for custom habit, treating as daily',
          );
          return true;
        }

        // Get today's weekday name
        const weekdayNames = [
          'sunday',
          'monday',
          'tuesday',
          'wednesday',
          'thursday',
          'friday',
          'saturday',
        ];
        const todayWeekday = weekdayNames[today.getDay()];

        // Check if today is one of the custom days
        return customDays.includes(todayWeekday);
      }

      default:
        this.logger.warn(
          `Unknown frequency type: ${String(frequencyType)}, treating as daily`,
        );
        return true;
    }
  }

  /**
   * Cron job that runs daily at 00:00 (midnight)
   * Queues streaks that need to be checked for reset (lastCompletionDate is 2+ days ago)
   */
  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async resetBrokenStreaks() {
    this.logger.log('Running daily streak reset job at midnight...');

    try {
      // Fetch all active streaks where currentStreak > 0
      const allStreaks = await this.streakService.getActiveStreaks();

      // Get today's date at 00:00:00
      // for example if today is 2026-01-16 10:02:43, then today will be 2026-01-16 00:00:00
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      // Filter streaks to only include habits that are due today
      const streaksDueToday = allStreaks.filter((streak) =>
        this.isHabitDueToday(
          streak.frequencyType,
          streak.lastCompletionDate,
          streak.intervalDays,
          streak.customDays,
        ),
      );

      this.logger.log(
        `Filtered ${allStreaks.length} active streaks to ${streaksDueToday.length} habits due today`,
      );

      // Prepare all jobs for bulk addition
      const jobs = streaksDueToday.map((streak) => {
        // Get last completion date at 00:00:00
        const lastCompletion = new Date(streak.lastCompletionDate);
        lastCompletion.setHours(0, 0, 0, 0);

        // Calculate days difference
        const daysDifference = Math.floor(
          (today.getTime() - lastCompletion.getTime()) / (1000 * 60 * 60 * 24),
        );

        const jobData: StreakResetJobData = {
          userId: streak.userId,
          habitId: streak.habitId,
          currentStreak: streak.currentStreak,
          lastCompletionDate: streak.lastCompletionDate,
          daysDifference,
          frequencyType: streak.frequencyType,
          intervalDays: streak.intervalDays,
          customDays: streak.customDays,
        };

        return {
          name: 'reset-streak',
          data: jobData,
          opts: {
            attempts: 3, // Retry up to 3 times on failure
            backoff: {
              // backoff means that if the job fails, it will be retried after a delay
              type: 'exponential' as const, // exponential means that the delay will be doubled each time
              delay: 2000, // Start with 2 second delay
            },
            removeOnComplete: true, // Clean up completed jobs
            removeOnFail: false, // Keep failed jobs for debugging
          },
        };
      });

      // Add all jobs to the queue at once
      await this.streakQueue.addBulk(jobs);

      this.logger.log(
        `Streak reset job completed. Queued ${jobs.length} streaks for processing.`,
      );
    } catch (error) {
      this.logger.error('Error running streak reset job:', error);
    }
  }
}
