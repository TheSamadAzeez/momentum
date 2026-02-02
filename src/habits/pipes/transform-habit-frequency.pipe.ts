import {
  PipeTransform,
  Injectable,
  ArgumentMetadata,
  BadRequestException,
} from '@nestjs/common';
import { FrequencyType, createHabitDTO } from '../dtos/create-habit.dto';

/**
 * Pipe to transform and validate habit frequency data in createHabitDTO.
 * Ensures that the fields align with the specified frequencyType.
 * - For 'daily': sets intervalDays to 1 and removes customDays.
 * - For 'interval': ensures intervalDays > 1 and removes customDays.
 * - For 'custom': removes intervalDays and ensures customDays is provided.
 * Throws BadRequestException for invalid configurations.
 */
@Injectable()
export class TransformHabitFrequencyPipe implements PipeTransform {
  transform(value: createHabitDTO, metadata: ArgumentMetadata) {
    // Only transform if this is a body parameter and has frequencyType
    if (metadata.type !== 'body' || !value.frequencyType) {
      return value;
    }

    // Create a transformed copy of the value
    const transformed = { ...value };

    switch (transformed.frequencyType) {
      case FrequencyType.DAILY:
        // For daily: set intervalDays to 1 and remove customDays
        transformed.intervalDays = 1;
        delete transformed.customDays;
        break;

      case FrequencyType.INTERVAL:
        // For interval: ensure intervalDays > 1 and remove customDays
        if (!transformed.intervalDays || transformed.intervalDays <= 1) {
          throw new BadRequestException(
            'For interval frequency type, intervalDays must be greater than 1',
          );
        }
        delete transformed.customDays;
        break;

      case FrequencyType.CUSTOM:
        // For custom: remove intervalDays, ensure customDays exists
        delete transformed.intervalDays;
        if (!transformed.customDays || transformed.customDays.length === 0) {
          throw new BadRequestException(
            'For custom frequency type, customDays array is required and must not be empty',
          );
        }
        break;

      default:
        throw new BadRequestException(
          `Invalid frequency type: ${String(transformed.frequencyType)}`,
        );
    }

    return transformed;
  }
}
