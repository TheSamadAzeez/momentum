import { Module } from '@nestjs/common';
import { StreakController } from './streak.controller';
import { StreakService } from './streak.service';
import { StreakSchedulerService } from './streak-scheduler.service';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [UsersModule],
  controllers: [StreakController],
  providers: [StreakService, StreakSchedulerService],
  exports: [StreakService],
})
export class StreakModule {}
