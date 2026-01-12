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

  @Get(':id')
  async getHabitById(
    @Param('id') id: string,
    @Session() session: { userId: string },
  ) {
    return await this.habitsService.getHabitById(id, session.userId);
  }

  @Patch(':id')
  @UsePipes(new TransformHabitFrequencyPipe())
  async updateHabit(
    @Param('id') id: string,
    @Session() session: { userId: string },
    @Body() habitData: createHabitDTO,
  ) {
    return await this.habitsService.updateHabit(id, session.userId, habitData);
  }

  @Delete(':id')
  async deleteHabit(
    @Param('id') id: string,
    @Session() session: { userId: string },
  ) {
    return await this.habitsService.deleteHabit(id, session.userId);
  }
}
