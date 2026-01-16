import { Module } from '@nestjs/common';
import { StreakController } from './streak.controller';
import { StreakService } from './streak.service';
import { StreakSchedulerService } from './streak-scheduler.service';

@Module({
  controllers: [StreakController],
  providers: [StreakService, StreakSchedulerService],
})
export class StreakModule {}
