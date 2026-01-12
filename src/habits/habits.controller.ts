import {
  Controller,
  Get,
  Post,
  Delete,
  Patch,
  Param,
  UseGuards,
  UsePipes,
  Session,
  Body,
} from '@nestjs/common';
import { HabitsService } from './habits.service';
import { AuthGuard } from 'src/guards/auth.guard';
import { createHabitDTO } from './dtos/create-habit.dto';
import { TransformHabitFrequencyPipe } from './pipes/transform-habit-frequency.pipe';

@Controller('habits')
@UseGuards(AuthGuard)
export class HabitsController {
  constructor(private readonly habitsService: HabitsService) {}

  @Post()
  @UsePipes(new TransformHabitFrequencyPipe())
  async createHabit(
    @Session() session: { userId: string },
    @Body() habitData: createHabitDTO,
  ) {
    return await this.habitsService.createHabit(session.userId, habitData);
  }

  @Get()
  async getAllHabits(@Session() session: { userId: string }) {
    return await this.habitsService.getAllHabits(session.userId);
  }

  @Get(':habitId')
  async getHabitById(
    @Param('habitId') habitId: string,
    @Session() session: { userId: string },
  ) {
    return await this.habitsService.getHabitById(habitId, session.userId);
  }

  @Patch(':habitId')
  @UsePipes(new TransformHabitFrequencyPipe())
  async updateHabit(
    @Param('habitId') habitId: string,
    @Session() session: { userId: string },
    @Body() habitData: createHabitDTO,
  ) {
    return await this.habitsService.updateHabit(
      habitId,
      session.userId,
      habitData,
    );
  }

  @Delete(':habitId')
  async deleteHabit(
    @Param('habitId') habitId: string,
    @Session() session: { userId: string },
  ) {
    return await this.habitsService.deleteHabit(habitId, session.userId);
  }

  @Post(':habitId/completed')
  async completeHabit(
    @Param('habitId') habitId: string,
    @Session() session: { userId: string },
  ) {
    return await this.habitsService.completeHabit(habitId, session.userId);
  }

  @Get(':habitId/logs')
  async getHabitLogs(
    @Param('habitId') habitId: string,
    @Session() session: { userId: string },
  ) {
    return await this.habitsService.getHabitLogs(habitId, session.userId);
  }
}
