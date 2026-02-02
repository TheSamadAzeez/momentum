import { Injectable, NotFoundException } from '@nestjs/common';
import { DrizzleService } from 'src/database/drizzle.service';
import { habitsTable } from 'src/database/schemas/habits';
import { streaksTable } from 'src/database/schemas/streaks';
import { habitLogTable } from 'src/database/schemas/habit-log';
import { eq, and, gte, lte, sql } from 'drizzle-orm';

@Injectable()
export class AnalyticsService {
  constructor(private readonly drizzleService: DrizzleService) {}

  // ==================== TIER 1: MVP ANALYTICS ====================

  /**
   * Calculate overall success rate for a user
   * Formula: (totalCompletions / (totalCompletions + totalMissedDays)) × 100
   */
  async getOverallSuccessRate(userId: string): Promise<number> {
    const habits = await this.drizzleService.db
      .select({
        totalCompletions: habitsTable.totalCompletions,
        totalMissedDays: habitsTable.totalMissedDays,
      })
      .from(habitsTable)
      .where(
        and(eq(habitsTable.userId, userId), eq(habitsTable.isActive, true)),
      );

    const totalCompletions = habits.reduce(
      (sum, h) => sum + h.totalCompletions,
      0,
    );
    const totalMissedDays = habits.reduce(
      (sum, h) => sum + h.totalMissedDays,
      0,
    );

    const total = totalCompletions + totalMissedDays;
    return total > 0 ? (totalCompletions / total) * 100 : 0;
  }

  /**
   * Get user streak summary (all streaks with current/longest values)
   */
  async getUserStreakSummary(userId: string) {
    const streaks = await this.drizzleService.db
      .select({
        habitId: streaksTable.habitId,
        habitTitle: habitsTable.title,
        currentStreak: streaksTable.currentStreak,
        longestStreak: streaksTable.longestStreak,
        lastCompletionDate: streaksTable.lastCompletionDate,
        streakStartDate: streaksTable.streakStartDate,
        totalResets: streaksTable.totalResets,
        totalDaysTracked: streaksTable.totalDaysTracked,
      })
      .from(streaksTable)
      .innerJoin(habitsTable, eq(streaksTable.habitId, habitsTable.id))
      .where(eq(streaksTable.userId, userId));

    const totalCurrentStreak = streaks.reduce(
      (sum, s) => sum + s.currentStreak,
      0,
    );
    const longestActiveStreak = Math.max(
      ...streaks.map((s) => s.currentStreak),
      0,
    );
    const allTimeLongestStreak = Math.max(
      ...streaks.map((s) => s.longestStreak),
      0,
    );

    return {
      streaks,
      totalCurrentStreak,
      longestActiveStreak,
      allTimeLongestStreak,
      activeStreaksCount: streaks.filter((s) => s.currentStreak > 0).length,
    };
  }

  /**
   * Get daily completion summary (habits completed today vs expected today)
   */
  async getDailyCompletionSummary(userId: string) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    // Get all active habits
    const activeHabits = await this.drizzleService.db
      .select()
      .from(habitsTable)
      .where(
        and(eq(habitsTable.userId, userId), eq(habitsTable.isActive, true)),
      );

    // Get habits completed today
    const completedToday = await this.drizzleService.db
      .select({
        habitId: habitLogTable.habitId,
        habitTitle: habitsTable.title,
        completedAt: habitLogTable.completedAt,
      })
      .from(habitLogTable)
      .innerJoin(habitsTable, eq(habitLogTable.habitId, habitsTable.id))
      .where(
        and(
          eq(habitsTable.userId, userId),
          gte(habitLogTable.logDate, today),
          lte(habitLogTable.logDate, tomorrow),
          eq(habitLogTable.completed, true),
        ),
      );

    // Filter habits expected today based on frequency
    const expectedToday = activeHabits.filter((habit) =>
      this.isHabitDueToday(
        habit.frequencyType,
        today,
        habit.intervalDays,
        habit.customDays,
      ),
    );

    return {
      completedToday: completedToday.length,
      expectedToday: expectedToday.length,
      completionRate:
        expectedToday.length > 0
          ? (completedToday.length / expectedToday.length) * 100
          : 0,
      completedHabits: completedToday,
      pendingHabits: expectedToday.filter(
        (h) => !completedToday.some((c) => c.habitId === h.id),
      ),
    };
  }

  /**
   * Get strongest habit (highest completion rate or longest current streak)
   */
  async getStrongestHabit(userId: string) {
    const habits = await this.drizzleService.db
      .select({
        id: habitsTable.id,
        title: habitsTable.title,
        totalCompletions: habitsTable.totalCompletions,
        totalMissedDays: habitsTable.totalMissedDays,
        currentStreak: streaksTable.currentStreak,
        longestStreak: streaksTable.longestStreak,
      })
      .from(habitsTable)
      .leftJoin(streaksTable, eq(habitsTable.id, streaksTable.habitId))
      .where(
        and(eq(habitsTable.userId, userId), eq(habitsTable.isActive, true)),
      );

    if (habits.length === 0) return null;

    // Calculate completion rate for each habit
    const habitsWithRate = habits.map((h) => {
      const total = h.totalCompletions + h.totalMissedDays;
      const completionRate = total > 0 ? (h.totalCompletions / total) * 100 : 0;
      return { ...h, completionRate };
    });

    // Find strongest by completion rate, then by current streak
    const strongest = habitsWithRate.reduce((best, current) => {
      if (current.completionRate > best.completionRate) return current;
      if (
        current.completionRate === best.completionRate &&
        (current.currentStreak || 0) > (best.currentStreak || 0)
      )
        return current;
      return best;
    });

    return strongest;
  }

  /**
   * Get weakest habit (lowest completion rate or highest risk score)
   */
  async getWeakestHabit(userId: string) {
    const habits = await this.drizzleService.db
      .select({
        id: habitsTable.id,
        title: habitsTable.title,
        totalCompletions: habitsTable.totalCompletions,
        totalMissedDays: habitsTable.totalMissedDays,
        consecutiveMisses: habitsTable.consecutiveMisses,
        currentStreak: streaksTable.currentStreak,
      })
      .from(habitsTable)
      .leftJoin(streaksTable, eq(habitsTable.id, streaksTable.habitId))
      .where(
        and(eq(habitsTable.userId, userId), eq(habitsTable.isActive, true)),
      );

    if (habits.length === 0) return null;

    // Calculate completion rate and risk score for each habit
    const habitsWithMetrics = habits.map((h) => {
      const total = h.totalCompletions + h.totalMissedDays;
      const completionRate = total > 0 ? (h.totalCompletions / total) * 100 : 0;
      const riskScore = this.calculateRiskScore(
        h.consecutiveMisses,
        completionRate,
      );
      return { ...h, completionRate, riskScore };
    });

    // Find weakest by lowest completion rate, then by highest risk score
    const weakest = habitsWithMetrics.reduce((worst, current) => {
      if (current.completionRate < worst.completionRate) return current;
      if (
        current.completionRate === worst.completionRate &&
        current.riskScore > worst.riskScore
      )
        return current;
      return worst;
    });

    return weakest;
  }

  /**
   * Get total active habits count
   */
  async getTotalActiveHabits(userId: string): Promise<number> {
    const result = await this.drizzleService.db
      .select({ count: sql<number>`count(*)` })
      .from(habitsTable)
      .where(
        and(eq(habitsTable.userId, userId), eq(habitsTable.isActive, true)),
      );

    return Number(result[0]?.count || 0);
  }

  /**
   * Get completion rate for a specific habit
   */
  async getHabitCompletionRate(
    habitId: string,
    userId: string,
  ): Promise<number> {
    const habit = await this.drizzleService.db.query.habitsTable.findFirst({
      where: and(eq(habitsTable.id, habitId), eq(habitsTable.userId, userId)),
    });

    if (!habit) {
      throw new NotFoundException('Habit not found');
    }

    const total = habit.totalCompletions + habit.totalMissedDays;
    return total > 0 ? (habit.totalCompletions / total) * 100 : 0;
  }

  // ==================== TIER 2: ENHANCED INTELLIGENCE ====================

  /**
   * Calculate consistency score (0-100)
   * Based on: streak maintenance, completion rate, and recovery ability
   */
  async getConsistencyScore(userId: string): Promise<number> {
    const successRate = await this.getOverallSuccessRate(userId);
    const streakSummary = await this.getUserStreakSummary(userId);

    const habits = await this.drizzleService.db
      .select()
      .from(habitsTable)
      .where(
        and(eq(habitsTable.userId, userId), eq(habitsTable.isActive, true)),
      );

    if (habits.length === 0) return 0;

    // Calculate average streak percentage (current vs longest)
    const avgStreakPercentage =
      streakSummary.streaks.length > 0
        ? streakSummary.streaks.reduce((sum, s) => {
            const percentage =
              s.longestStreak > 0
                ? (s.currentStreak / s.longestStreak) * 100
                : 0;
            return sum + percentage;
          }, 0) / streakSummary.streaks.length
        : 0;

    // Calculate recovery rate (habits with recovery vs total habits)
    const habitsWithRecovery = habits.filter((h) => h.lastRecoveryDate).length;
    const recoveryRate = (habitsWithRecovery / habits.length) * 100;

    // Weighted consistency score
    const consistencyScore =
      successRate * 0.5 + // 50% weight on success rate
      avgStreakPercentage * 0.3 + // 30% weight on streak maintenance
      recoveryRate * 0.2; // 20% weight on recovery ability

    return Math.min(100, Math.max(0, consistencyScore));
  }

  /**
   * Calculate risk score for a habit (0-100, higher = more at risk)
   */
  async getHabitRiskScore(habitId: string, userId: string): Promise<number> {
    const habit = await this.drizzleService.db.query.habitsTable.findFirst({
      where: and(eq(habitsTable.id, habitId), eq(habitsTable.userId, userId)),
    });

    if (!habit) {
      throw new NotFoundException('Habit not found');
    }

    const total = habit.totalCompletions + habit.totalMissedDays;
    const completionRate =
      total > 0 ? (habit.totalCompletions / total) * 100 : 0;

    return this.calculateRiskScore(habit.consecutiveMisses, completionRate);
  }

  /**
   * Get weekly trends (last 4 weeks)
   */
  async getWeeklyTrends(userId: string) {
    const weeks: Array<{
      weekStart: string;
      weekEnd: string;
      completions: number;
    }> = [];
    const today = new Date();

    for (let i = 0; i < 4; i++) {
      const weekEnd = new Date(today);
      weekEnd.setDate(weekEnd.getDate() - i * 7);
      weekEnd.setHours(23, 59, 59, 999);

      const weekStart = new Date(weekEnd);
      weekStart.setDate(weekStart.getDate() - 6);
      weekStart.setHours(0, 0, 0, 0);

      const completions = await this.drizzleService.db
        .select({ count: sql<number>`count(*)` })
        .from(habitLogTable)
        .innerJoin(habitsTable, eq(habitLogTable.habitId, habitsTable.id))
        .where(
          and(
            eq(habitsTable.userId, userId),
            gte(habitLogTable.logDate, weekStart),
            lte(habitLogTable.logDate, weekEnd),
            eq(habitLogTable.completed, true),
          ),
        );

      weeks.unshift({
        weekStart: weekStart.toISOString().split('T')[0],
        weekEnd: weekEnd.toISOString().split('T')[0],
        completions: Number(completions[0]?.count || 0),
      });
    }

    return weeks;
  }

  /**
   * Get monthly trends (last 6 months)
   */
  async getMonthlyTrends(userId: string) {
    const months: Array<{ month: string; completions: number }> = [];
    const today = new Date();

    for (let i = 0; i < 6; i++) {
      const monthDate = new Date(today.getFullYear(), today.getMonth() - i, 1);
      const monthStart = new Date(
        monthDate.getFullYear(),
        monthDate.getMonth(),
        1,
      );
      monthStart.setHours(0, 0, 0, 0);

      const monthEnd = new Date(
        monthDate.getFullYear(),
        monthDate.getMonth() + 1,
        0,
      );
      monthEnd.setHours(23, 59, 59, 999);

      const completions = await this.drizzleService.db
        .select({ count: sql<number>`count(*)` })
        .from(habitLogTable)
        .innerJoin(habitsTable, eq(habitLogTable.habitId, habitsTable.id))
        .where(
          and(
            eq(habitsTable.userId, userId),
            gte(habitLogTable.logDate, monthStart),
            lte(habitLogTable.logDate, monthEnd),
            eq(habitLogTable.completed, true),
          ),
        );

      months.unshift({
        month: monthStart.toISOString().split('T')[0].substring(0, 7),
        completions: Number(completions[0]?.count || 0),
      });
    }

    return months;
  }

  /**
   * Get missed days tracking for a habit
   */
  async getMissedDaysTracking(habitId: string, userId: string) {
    const habit = await this.drizzleService.db.query.habitsTable.findFirst({
      where: and(eq(habitsTable.id, habitId), eq(habitsTable.userId, userId)),
    });

    if (!habit) {
      throw new NotFoundException('Habit not found');
    }

    return {
      totalMissedDays: habit.totalMissedDays,
      consecutiveMisses: habit.consecutiveMisses,
      lastMissedDate: habit.lastMissedDate,
    };
  }

  /**
   * Calculate recovery rate for a habit
   * Formula: Average time to recover after missing a day
   */
  async getRecoveryRate(habitId: string, userId: string) {
    const habit = await this.drizzleService.db.query.habitsTable.findFirst({
      where: and(eq(habitsTable.id, habitId), eq(habitsTable.userId, userId)),
    });

    if (!habit) {
      throw new NotFoundException('Habit not found');
    }

    const streak = await this.drizzleService.db.query.streaksTable.findFirst({
      where: and(
        eq(streaksTable.habitId, habitId),
        eq(streaksTable.userId, userId),
      ),
    });

    const recoveryRate =
      habit.totalCompletions > 0
        ? (streak?.totalResets || 0) / habit.totalCompletions
        : 0;

    return {
      totalResets: streak?.totalResets || 0,
      lastResetDate: streak?.lastResetDate,
      lastRecoveryDate: habit.lastRecoveryDate,
      recoveryRate: recoveryRate * 100, // As percentage
      hasRecovered: !!habit.lastRecoveryDate,
    };
  }

  /**
   * Get habit age (days since creation)
   */
  async getHabitAge(habitId: string, userId: string): Promise<number> {
    const habit = await this.drizzleService.db.query.habitsTable.findFirst({
      where: and(eq(habitsTable.id, habitId), eq(habitsTable.userId, userId)),
    });

    if (!habit) {
      throw new NotFoundException('Habit not found');
    }

    const today = new Date();
    const createdAt = new Date(habit.createdAt);
    const diffTime = Math.abs(today.getTime() - createdAt.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    return diffDays;
  }

  /**
   * Get comprehensive analytics summary (Tier 1 + Tier 2)
   */
  async getAnalyticsSummary(userId: string) {
    const [
      overallSuccessRate,
      streakSummary,
      dailySummary,
      strongestHabit,
      weakestHabit,
      totalActiveHabits,
      consistencyScore,
      weeklyTrends,
      monthlyTrends,
    ] = await Promise.all([
      this.getOverallSuccessRate(userId),
      this.getUserStreakSummary(userId),
      this.getDailyCompletionSummary(userId),
      this.getStrongestHabit(userId),
      this.getWeakestHabit(userId),
      this.getTotalActiveHabits(userId),
      this.getConsistencyScore(userId),
      this.getWeeklyTrends(userId),
      this.getMonthlyTrends(userId),
    ]);

    return {
      // Tier 1 Metrics
      overallSuccessRate: Math.round(overallSuccessRate * 100) / 100,
      totalActiveHabits,
      streakSummary,
      dailySummary,
      strongestHabit,
      weakestHabit,
      // Tier 2 Metrics
      consistencyScore: Math.round(consistencyScore * 100) / 100,
      weeklyTrends,
      monthlyTrends,
    };
  }

  // ==================== HELPER METHODS ====================

  /**
   * Calculate risk score based on consecutive misses and completion rate
   */
  private calculateRiskScore(
    consecutiveMisses: number,
    completionRate: number,
  ): number {
    // Risk increases exponentially with consecutive misses
    const missRisk = Math.min(100, consecutiveMisses * 25);

    // Risk increases as completion rate decreases
    const completionRisk = 100 - completionRate;

    // Weighted risk score (60% consecutive misses, 40% completion rate)
    return missRisk * 0.6 + completionRisk * 0.4;
  }

  /**
   * Check if a habit is due today based on frequency type
   */
  private isHabitDueToday(
    frequencyType: 'daily' | 'interval' | 'custom',
    today: Date,
    intervalDays: number | null,
    customDays: string[] | null,
  ): boolean {
    switch (frequencyType) {
      case 'daily':
        return true;

      case 'interval':
        // For interval habits, we'd need last completion date to determine
        // For now, we'll assume they're always due (can be refined)
        return true;

      case 'custom': {
        if (!customDays || customDays.length === 0) return true;

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
        return customDays.includes(todayWeekday);
      }

      default:
        return true;
    }
  }
}
