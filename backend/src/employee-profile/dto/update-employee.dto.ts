import { PartialType } from '@nestjs/mapped-types';
import { CreateEmployeeDto } from './create-employee.dto';
import {IsArray, IsString, IsOptional, IsDateString, IsEnum, IsObject, IsMongoId } from 'class-validator';
import { ContractType, WorkType, EmployeeStatus, SystemRole } from '../enums/employee-profile.enums';

export class UpdateEmployeeDto extends PartialType(CreateEmployeeDto) {
  @IsOptional()
  @IsArray()
  @IsEnum(SystemRole, { each: true })
  roles?: SystemRole[];

  @IsOptional()
  @IsString()
  @IsMongoId({ message: 'Primary Position ID must be a valid MongoDB ObjectId' })
  primaryPositionId?: string;

  @IsOptional()
  @IsString()
  @IsMongoId({ message: 'Primary Department ID must be a valid MongoDB ObjectId' })
  primaryDepartmentId?: string;

  @IsOptional()
  @IsString()
  @IsMongoId({ message: 'Supervisor Position ID must be a valid MongoDB ObjectId' })
  supervisorPositionId?: string;
}
