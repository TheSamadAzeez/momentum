import {
  Controller,
  Get,
  Post,
  Patch,
  Session,
  UseGuards,
  Param,
  Body,
} from '@nestjs/common';
import { AuthGuard } from 'src/guards/auth.guard';
import { StreakService } from './streak.service';

@Controller('streak')
@UseGuards(AuthGuard)
export class StreakController {
  constructor(private readonly streakService: StreakService) {}

  @Get()
  getAllStreaks(@Session() session: { userId: string }) {
    return this.streakService.getAllStreaks(session.userId);
  }

  @Get(':habitId')
  getHabitStreak(
    @Session() session: { userId: string },
    @Param('habitId') habitId: string,
  ) {
    return this.streakService.getHabitStreak(session.userId, habitId);
  }

  @Post(':habitId')
  createStreak(
    @Session() session: { userId: string },
    @Param('habitId') habitId: string,
  ) {
    return this.streakService.createStreak(session.userId, habitId);
  }

  @Post(':habitId/increment')
  incrementStreak(
    @Session() session: { userId: string },
    @Param('habitId') habitId: string,
  ) {
    return this.streakService.incrementStreak(session.userId, habitId);
  }

  @Patch(':habitId')
  updateStreak(
    @Session() session: { userId: string },
    @Param('habitId') habitId: string,
    @Body() body: { currentStreak: number; longestStreak?: number },
  ) {
    return this.streakService.updateStreak(
      session.userId,
      habitId,
      body.currentStreak,
      body.longestStreak,
    );
  }

  @Patch(':habitId/reset')
  resetStreak(
    @Session() session: { userId: string },
    @Param('habitId') habitId: string,
  ) {
    return this.streakService.resetStreak(session.userId, habitId);
  }
}
