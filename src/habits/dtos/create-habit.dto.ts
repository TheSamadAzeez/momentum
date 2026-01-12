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
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsNotEmpty()
  @IsEnum(FrequencyType)
  frequencyType: FrequencyType;

  @IsOptional()
  @IsInt()
  intervalDays?: number;

  @IsOptional()
  @IsArray()
  @IsEnum(Weekday, { each: true })
  @ArrayMinSize(1)
  customDays?: Weekday[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @ArrayMinSize(1)
  reminderTimes?: string[];

  @IsOptional()
  @IsBoolean()
  isActive?: boolean; // Defaults to true in the database
}
