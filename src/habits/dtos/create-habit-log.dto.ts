import {
  IsNotEmpty,
  IsUUID,
  IsDateString,
  IsBoolean,
  IsOptional,
} from 'class-validator';

export class CreateHabitLogDto {
  @IsNotEmpty()
  @IsUUID()
  habitId: string;

  @IsOptional()
  @IsDateString()
  logDate?: string;

  @IsNotEmpty()
  @IsBoolean()
  completed: boolean;

  @IsOptional()
  @IsDateString()
  completedAt?: string;
}
