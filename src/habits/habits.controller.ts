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
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
  ApiCookieAuth,
} from '@nestjs/swagger';
import { HabitsService } from './habits.service';
import { AuthGuard } from 'src/guards/auth.guard';
import { createHabitDTO } from './dtos/create-habit.dto';
import { TransformHabitFrequencyPipe } from './pipes/transform-habit-frequency.pipe';

@ApiTags('habits')
@ApiCookieAuth('session')
@Controller('habits')
@UseGuards(AuthGuard)
export class HabitsController {
  constructor(private readonly habitsService: HabitsService) {}

  @ApiOperation({ summary: 'Create a new habit' })
  @ApiBody({ type: createHabitDTO })
  @ApiResponse({ status: 201, description: 'Habit created successfully' })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @Post()
  @UsePipes(new TransformHabitFrequencyPipe())
  async createHabit(
    @Session() session: { userId: string },
    @Body() habitData: createHabitDTO,
  ) {
    return await this.habitsService.createHabit(session.userId, habitData);
  }

  @ApiOperation({ summary: 'Get all habits for the current user' })
  @ApiResponse({
    status: 200,
    description: 'List of habits retrieved successfully',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @Get()
  async getAllHabits(@Session() session: { userId: string }) {
    return await this.habitsService.getAllHabits(session.userId);
  }

  @ApiOperation({ summary: 'Get a specific habit by ID' })
  @ApiParam({ name: 'habitId', description: 'Unique identifier of the habit' })
  @ApiResponse({ status: 200, description: 'Habit retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Habit not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @Get(':habitId')
  async getHabitById(
    @Param('habitId') habitId: string,
    @Session() session: { userId: string },
  ) {
    return await this.habitsService.getHabitById(habitId, session.userId);
  }

  @ApiOperation({ summary: 'Update an existing habit' })
  @ApiParam({ name: 'habitId', description: 'Unique identifier of the habit' })
  @ApiBody({ type: createHabitDTO })
  @ApiResponse({ status: 200, description: 'Habit updated successfully' })
  @ApiResponse({ status: 404, description: 'Habit not found' })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
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

  @ApiOperation({ summary: 'Delete a habit' })
  @ApiParam({ name: 'habitId', description: 'Unique identifier of the habit' })
  @ApiResponse({ status: 200, description: 'Habit deleted successfully' })
  @ApiResponse({ status: 404, description: 'Habit not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @Delete(':habitId')
  async deleteHabit(
    @Param('habitId') habitId: string,
    @Session() session: { userId: string },
  ) {
    return await this.habitsService.deleteHabit(habitId, session.userId);
  }

  @ApiOperation({ summary: 'Mark a habit as completed for today' })
  @ApiParam({ name: 'habitId', description: 'Unique identifier of the habit' })
  @ApiResponse({ status: 201, description: 'Habit marked as completed' })
  @ApiResponse({ status: 404, description: 'Habit not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @Post(':habitId/completed')
  async completeHabit(
    @Param('habitId') habitId: string,
    @Session() session: { userId: string },
  ) {
    return await this.habitsService.completeHabit(habitId, session.userId);
  }

  @ApiOperation({ summary: 'Get completion logs for a habit' })
  @ApiParam({ name: 'habitId', description: 'Unique identifier of the habit' })
  @ApiResponse({
    status: 200,
    description: 'Habit logs retrieved successfully',
  })
  @ApiResponse({ status: 404, description: 'Habit not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @Get(':habitId/logs')
  async getHabitLogs(
    @Param('habitId') habitId: string,
    @Session() session: { userId: string },
  ) {
    return await this.habitsService.getHabitLogs(habitId, session.userId);
  }
}
