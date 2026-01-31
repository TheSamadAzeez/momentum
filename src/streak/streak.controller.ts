import { Controller, Get, Session, UseGuards, Param } from '@nestjs/common';
import { AuthGuard } from 'src/guards/auth.guard';
import { StreakService } from './streak.service';

@Controller('streak')
@UseGuards(AuthGuard)
export class StreakController {
  constructor(private readonly streakService: StreakService) {}

  @Get()
  getUserStreak(@Session() session: { userId: string }) {
    return this.streakService.getUserStreak(session.userId);
  }
  @Get('/all')
  async getAllStreaks(@Session() session: { userId: string }) {
    return await this.streakService.getAllStreaks(session.userId);
  }

  @Get(':habitId')
  async getHabitStreak(
    @Session() session: { userId: string },
    @Param('habitId') habitId: string,
  ) {
    return await this.streakService.getHabitStreak(session.userId, habitId);
  }
}
