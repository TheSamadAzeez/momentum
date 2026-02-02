import { Controller, Get, Session, UseGuards, Param } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiCookieAuth,
} from '@nestjs/swagger';
import { AuthGuard } from 'src/guards/auth.guard';
import { AnalyticsService } from './analytics.service';

@ApiTags('analytics')
@ApiCookieAuth('session')
@Controller('analytics')
@UseGuards(AuthGuard)
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  /**
   * GET /analytics/summary
   * Comprehensive analytics dashboard (Tier 1 + Tier 2)
   */
  @ApiOperation({
    summary: 'Get comprehensive analytics dashboard',
    description:
      'Returns Tier 1 and Tier 2 analytics including success rate, streaks, and trends',
  })
  @ApiResponse({
    status: 200,
    description: 'Analytics summary retrieved successfully',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @Get('/summary')
  async getAnalyticsSummary(@Session() session: { userId: string }) {
    const summary = await this.analyticsService.getAnalyticsSummary(
      session.userId,
    );
    return {
      status: 'success',
      message: 'Analytics summary retrieved',
      data: summary,
    };
  }

  /**
   * GET /analytics/success-rate
   * Overall success rate for the user
   */
  @ApiOperation({
    summary: 'Get overall success rate',
    description:
      'Calculate the overall habit completion success rate for the user',
  })
  @ApiResponse({
    status: 200,
    description: 'Success rate calculated successfully',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @Get('/success-rate')
  async getSuccessRate(@Session() session: { userId: string }) {
    const successRate = await this.analyticsService.getOverallSuccessRate(
      session.userId,
    );
    return {
      status: 'success',
      message: 'Success rate calculated',
      data: { successRate },
    };
  }

  /**
   * GET /analytics/streaks
   * User streak summary
   */
  @ApiOperation({
    summary: 'Get streak summary',
    description:
      'Returns summary of user streaks including current and longest streaks',
  })
  @ApiResponse({
    status: 200,
    description: 'Streak summary retrieved successfully',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @Get('/streaks')
  async getStreakSummary(@Session() session: { userId: string }) {
    const streakSummary = await this.analyticsService.getUserStreakSummary(
      session.userId,
    );
    return {
      status: 'success',
      message: 'Streak summary retrieved',
      data: streakSummary,
    };
  }

  /**
   * GET /analytics/daily
   * Daily completion summary
   */
  @ApiOperation({
    summary: 'Get daily completion summary',
    description: 'Returns daily habit completion statistics',
  })
  @ApiResponse({
    status: 200,
    description: 'Daily summary retrieved successfully',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @Get('/daily')
  async getDailySummary(@Session() session: { userId: string }) {
    const dailySummary = await this.analyticsService.getDailyCompletionSummary(
      session.userId,
    );
    return {
      status: 'success',
      message: 'Daily summary retrieved',
      data: dailySummary,
    };
  }

  /**
   * GET /analytics/strongest-habit
   * Get strongest habit
   */
  @ApiOperation({
    summary: 'Get strongest habit',
    description: 'Returns the habit with the highest completion rate',
  })
  @ApiResponse({ status: 200, description: 'Strongest habit found' })
  @ApiResponse({ status: 404, description: 'No habits found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @Get('/strongest-habit')
  async getStrongestHabit(@Session() session: { userId: string }) {
    const strongestHabit = await this.analyticsService.getStrongestHabit(
      session.userId,
    );
    return {
      status: 'success',
      message: strongestHabit ? 'Strongest habit found' : 'No habits found',
      data: strongestHabit,
    };
  }

  /**
   * GET /analytics/weakest-habit
   * Get weakest habit
   */
  @ApiOperation({
    summary: 'Get weakest habit',
    description: 'Returns the habit with the lowest completion rate',
  })
  @ApiResponse({ status: 200, description: 'Weakest habit found' })
  @ApiResponse({ status: 404, description: 'No habits found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @Get('/weakest-habit')
  async getWeakestHabit(@Session() session: { userId: string }) {
    const weakestHabit = await this.analyticsService.getWeakestHabit(
      session.userId,
    );
    return {
      status: 'success',
      message: weakestHabit ? 'Weakest habit found' : 'No habits found',
      data: weakestHabit,
    };
  }

  /**
   * GET /analytics/consistency-score
   * Get consistency score (Tier 2)
   */
  @ApiOperation({
    summary: 'Get consistency score',
    description: 'Calculate overall habit consistency score (Tier 2 analytics)',
  })
  @ApiResponse({
    status: 200,
    description: 'Consistency score calculated successfully',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @Get('/consistency-score')
  async getConsistencyScore(@Session() session: { userId: string }) {
    const consistencyScore = await this.analyticsService.getConsistencyScore(
      session.userId,
    );
    return {
      status: 'success',
      message: 'Consistency score calculated',
      data: { consistencyScore },
    };
  }

  /**
   * GET /analytics/trends/weekly
   * Weekly trends (last 4 weeks)
   */
  @ApiOperation({
    summary: 'Get weekly trends',
    description: 'Returns habit completion trends for the last 4 weeks',
  })
  @ApiResponse({
    status: 200,
    description: 'Weekly trends retrieved successfully',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @Get('/trends/weekly')
  async getWeeklyTrends(@Session() session: { userId: string }) {
    const weeklyTrends = await this.analyticsService.getWeeklyTrends(
      session.userId,
    );
    return {
      status: 'success',
      message: 'Weekly trends retrieved',
      data: weeklyTrends,
    };
  }

  /**
   * GET /analytics/trends/monthly
   * Monthly trends (last 6 months)
   */
  @ApiOperation({
    summary: 'Get monthly trends',
    description: 'Returns habit completion trends for the last 6 months',
  })
  @ApiResponse({
    status: 200,
    description: 'Monthly trends retrieved successfully',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @Get('/trends/monthly')
  async getMonthlyTrends(@Session() session: { userId: string }) {
    const monthlyTrends = await this.analyticsService.getMonthlyTrends(
      session.userId,
    );
    return {
      status: 'success',
      message: 'Monthly trends retrieved',
      data: monthlyTrends,
    };
  }

  /**
   * GET /analytics/habits/:habitId
   * Per-habit analytics
   */
  @ApiOperation({
    summary: 'Get per-habit analytics',
    description:
      'Returns detailed analytics for a specific habit including completion rate, risk score, and recovery rate',
  })
  @ApiParam({ name: 'habitId', description: 'Unique identifier of the habit' })
  @ApiResponse({
    status: 200,
    description: 'Habit analytics retrieved successfully',
  })
  @ApiResponse({ status: 404, description: 'Habit not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @Get('/habits/:habitId')
  async getHabitAnalytics(
    @Param('habitId') habitId: string,
    @Session() session: { userId: string },
  ) {
    const [completionRate, riskScore, missedDays, recoveryRate, habitAge] =
      await Promise.all([
        this.analyticsService.getHabitCompletionRate(habitId, session.userId),
        this.analyticsService.getHabitRiskScore(habitId, session.userId),
        this.analyticsService.getMissedDaysTracking(habitId, session.userId),
        this.analyticsService.getRecoveryRate(habitId, session.userId),
        this.analyticsService.getHabitAge(habitId, session.userId),
      ]);

    return {
      status: 'success',
      message: 'Habit analytics retrieved',
      data: {
        completionRate,
        riskScore,
        missedDays,
        recoveryRate,
        habitAge,
      },
    };
  }

  /**
   * GET /analytics/risk
   * Get all habits with their risk scores
   */
  @ApiOperation({
    summary: 'Get risk scores information',
    description:
      'Returns information about accessing individual habit risk scores',
  })
  @ApiResponse({
    status: 200,
    description: 'Risk scores information retrieved',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @Get('/risk')
  getRiskScores() {
    // This would require fetching all habits and calculating risk for each
    // For now, we'll return a simple message
    return {
      status: 'success',
      message: 'Use /analytics/habits/:habitId to get individual risk scores',
      data: null,
    };
  }
}
