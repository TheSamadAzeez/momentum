import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import { Job } from 'bullmq';
import { StreakService } from './streak.service';

export interface StreakResetJobData {
  userId: string;
  habitId: string;
  currentStreak: number;
  lastCompletionDate: Date;
  daysDifference: number;
  frequencyType: 'daily' | 'interval' | 'custom';
  intervalDays: number | null;
  customDays: string[] | null;
}

@Processor('streak')
export class StreakProcessor extends WorkerHost {
  private readonly logger = new Logger(StreakProcessor.name);

  constructor(private readonly streakService: StreakService) {
    super(); // super() in simple terms is like calling the constructor of the parent class "WorkerHost"
  }

  async process(job: Job<StreakResetJobData>): Promise<void> {
    // promise<void> means that the function will not return anything
    const { userId, habitId, currentStreak, daysDifference } = job.data;

    this.logger.debug(
      `Processing streak reset for user ${userId}, habit ${habitId} (job ${job.id})`,
    );

    try {
      // Only reset if lastCompletionDate is 2+ days ago (streak is broken)
      // If it's 1 day ago (yesterday), user still has today to maintain their streak
      if (daysDifference >= 2 && currentStreak > 0) {
        await this.streakService.resetStreak(userId, habitId);

        this.logger.debug(
          `Reset streak for user ${userId}, habit ${habitId} (was ${currentStreak}, last completion: ${daysDifference} days ago)`,
        );
      }
    } catch (error) {
      this.logger.error(
        `Error processing streak reset for user ${userId}, habit ${habitId}:`,
        error,
      );
      throw error; // Re-throw to mark job as failed
    }
  }
}
