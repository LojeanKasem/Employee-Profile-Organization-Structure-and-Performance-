import {
  PipeTransform,
  Injectable,
  ArgumentMetadata,
  BadRequestException,
} from '@nestjs/common';
import { Types } from 'mongoose';

/**
 * Validates that a string parameter is a valid MongoDB ObjectId
 * Use this pipe on @Param() or @Query() decorators
 * 
 * Example:
 * @Get(':id')
 * findOne(@Param('id', ObjectIdValidationPipe) id: string) { ... }
 */
@Injectable()
export class ObjectIdValidationPipe implements PipeTransform<string, string> {
  transform(value: string, metadata: ArgumentMetadata): string {
    if (!value) {
      throw new BadRequestException(`${metadata.data || 'Parameter'} is required`);
    }

    if (!Types.ObjectId.isValid(value)) {
      throw new BadRequestException(
        `${metadata.data || 'Parameter'} must be a valid MongoDB ObjectId`
      );
    }

    return value;
  }
}

