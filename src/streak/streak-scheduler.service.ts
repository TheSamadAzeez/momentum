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

      let queuedCount = 0; // counter for the number of streaks queued for processing

      // Add each streak to the queue for processing
      for (const streak of allStreaks) {
        // Get last completion date at 00:00:00
        const lastCompletion = new Date(streak.lastCompletionDate);
        lastCompletion.setHours(0, 0, 0, 0);

        // Calculate days difference
        const daysDifference = Math.floor(
          (today.getTime() - lastCompletion.getTime()) / (1000 * 60 * 60 * 24),
        );

        // Add to queue for processing
        const jobData: StreakResetJobData = {
          userId: streak.userId,
          habitId: streak.habitId,
          currentStreak: streak.currentStreak,
          lastCompletionDate: streak.lastCompletionDate,
          daysDifference,
        };

        await this.streakQueue.add('reset-streak', jobData, {
          attempts: 3, // Retry up to 3 times on failure
          backoff: {
            // backoff means that if the job fails, it will be retried after a delay
            type: 'exponential', // exponential means that the delay will be doubled each time
            delay: 2000, // Start with 2 second delay
          },
          removeOnComplete: true, // Clean up completed jobs
          removeOnFail: false, // Keep failed jobs for debugging
        });

        queuedCount++;
      }

      this.logger.log(
        `Streak reset job completed. Queued ${queuedCount} streaks for processing.`,
      );
    } catch (error) {
      this.logger.error('Error running streak reset job:', error);
    }
  }
}
