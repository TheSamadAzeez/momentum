import { Module } from '@nestjs/common';
import { StreakController } from './streak.controller';
import { StreakService } from './streak.service';
import { StreakSchedulerService } from './streak-scheduler.service';
import { StreakProcessor } from './streak.processor';
import { UsersModule } from 'src/users/users.module';
import { BullModule } from '@nestjs/bullmq';

@Module({
  imports: [UsersModule, BullModule.registerQueue({ name: 'streak' })],
  controllers: [StreakController],
  providers: [StreakService, StreakSchedulerService, StreakProcessor],
  exports: [StreakService],
})
export class StreakModule {}
