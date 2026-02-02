import {
  IsNotEmpty,
  IsString,
  IsOptional,
  IsEnum,
  IsInt,
  IsArray,
  IsBoolean,
  ArrayMinSize,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

// Define the frequency type enum to match the schema
export enum FrequencyType {
  DAILY = 'daily',
  INTERVAL = 'interval',
  CUSTOM = 'custom',
}

// Define the weekday enum to match the schema
export enum Weekday {
  MONDAY = 'monday',
  TUESDAY = 'tuesday',
  WEDNESDAY = 'wednesday',
  THURSDAY = 'thursday',
  FRIDAY = 'friday',
  SATURDAY = 'saturday',
  SUNDAY = 'sunday',
}

export class createHabitDTO {
  @ApiProperty({
    description: 'Habit title',
    example: 'Morning Exercise',
  })
  @IsNotEmpty()
  @IsString()
  title: string;

  @ApiProperty({
    description: 'Detailed description of the habit',
    example: '30 minutes of cardio or strength training',
    required: false,
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    description: 'How often the habit should be performed',
    enum: FrequencyType,
    example: FrequencyType.DAILY,
  })
  @IsNotEmpty()
  @IsEnum(FrequencyType)
  frequencyType: FrequencyType;

  @ApiProperty({
    description:
      'Number of days between habit occurrences (required if frequencyType is INTERVAL)',
    example: 3,
    required: false,
  })
  @IsOptional()
  @IsInt()
  intervalDays?: number;

  @ApiProperty({
    description:
      'Specific days of the week for the habit (required if frequencyType is CUSTOM)',
    enum: Weekday,
    isArray: true,
    example: [Weekday.MONDAY, Weekday.WEDNESDAY, Weekday.FRIDAY],
    required: false,
  })
  @IsOptional()
  @IsArray()
  @IsEnum(Weekday, { each: true })
  @ArrayMinSize(1)
  customDays?: Weekday[];

  @ApiProperty({
    description: 'Times to send reminders (HH:MM format)',
    isArray: true,
    example: ['08:00', '20:00'],
    required: false,
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @ArrayMinSize(1)
  reminderTimes?: string[];

  @ApiProperty({
    description: 'Whether the habit is active',
    example: true,
    default: true,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean; // Defaults to true in the database
}
