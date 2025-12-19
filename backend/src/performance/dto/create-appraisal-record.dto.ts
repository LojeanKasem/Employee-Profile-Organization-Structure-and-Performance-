// src/performance/dto/create-appraisal-record.dto.ts
import { IsArray, IsMongoId, IsOptional, IsString, ValidateNested, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';
import { RatingEntryDto } from './rating-entry.dto';

export class CreateAppraisalRecordDto {
  @IsOptional()
  @IsMongoId()
  assignmentId?: string;

  @IsMongoId()
  cycleId: string;

  @IsMongoId()
  templateId: string;

  @IsString()
  employeeProfileId: string; // Can be ObjectId or employeeNumber

  // managerProfileId will come from logged-in user in service/controller, not the body

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => RatingEntryDto)
  ratings?: RatingEntryDto[];

  @IsOptional()
  @IsNumber()
  totalScore?: number;

  @IsOptional()
  @IsString()
  overallRatingLabel?: string;

  @IsOptional()
  @IsString()
  managerSummary?: string;

  @IsOptional()
  @IsString()
  strengths?: string;

  @IsOptional()
  @IsString()
  improvementAreas?: string;
}
