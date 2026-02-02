import { Controller, Get, Session, UseGuards, Param } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiCookieAuth,
} from '@nestjs/swagger';
import { AuthGuard } from 'src/guards/auth.guard';
import { StreakService } from './streak.service';

@ApiTags('streaks')
@ApiCookieAuth('session')
@Controller('streak')
@UseGuards(AuthGuard)
export class StreakController {
  constructor(private readonly streakService: StreakService) {}

  @ApiOperation({ summary: "Get current user's overall streak" })
  @ApiResponse({
    status: 200,
    description: 'User streak retrieved successfully',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @Get()
  getUserStreak(@Session() session: { userId: string }) {
    return this.streakService.getUserStreak(session.userId);
  }
  @ApiOperation({ summary: 'Get all streaks for the current user' })
  @ApiResponse({
    status: 200,
    description: 'All streaks retrieved successfully',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @Get('/all')
  async getAllStreaks(@Session() session: { userId: string }) {
    return await this.streakService.getAllStreaks(session.userId);
  }

  @ApiOperation({ summary: 'Get streak for a specific habit' })
  @ApiParam({ name: 'habitId', description: 'Unique identifier of the habit' })
  @ApiResponse({
    status: 200,
    description: 'Habit streak retrieved successfully',
  })
  @ApiResponse({ status: 404, description: 'Habit not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @Get(':habitId')
  async getHabitStreak(
    @Session() session: { userId: string },
    @Param('habitId') habitId: string,
  ) {
    return await this.streakService.getHabitStreak(session.userId, habitId);
  }
}
