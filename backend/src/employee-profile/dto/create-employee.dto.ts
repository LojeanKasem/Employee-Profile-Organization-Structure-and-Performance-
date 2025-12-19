import { IsString, IsOptional, IsDateString, IsEnum, IsObject, IsMongoId } from 'class-validator';
import { ContractType, WorkType, EmployeeStatus, SystemRole } from '../enums/employee-profile.enums';

export class CreateEmployeeDto {
  // UserProfileBase fields
  @IsString()
  firstName: string;

  @IsString()
  lastName: string;

  @IsString()
  nationalId: string;

  @IsObject()
  address: {
    street: string;
    city: string;
    country: string;
  };

  @IsString()
  phone: string;

  @IsString()
  personalEmail: string;
  @IsString()
  password: string;
  // EmployeeProfile fields
  @IsString()
  employeeNumber: string;
   
  @IsEnum(SystemRole)
 role: SystemRole;

  @IsDateString()
  dateOfHire: string;

  @IsOptional()
  @IsString()
  workEmail?: string;

  @IsOptional()
  @IsString()
  biography?: string;

  @IsOptional()
  @IsDateString()
  contractStartDate?: string;

  @IsOptional()
  @IsDateString()
  contractEndDate?: string;

  @IsOptional()
  @IsEnum(ContractType)
  contractType?: ContractType;

  @IsOptional()
  @IsEnum(WorkType)
  workType?: WorkType;

  @IsOptional()
  @IsEnum(EmployeeStatus)
  status?: EmployeeStatus;

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

  @IsOptional()
  @IsString()
  @IsMongoId({ message: 'Pay Grade ID must be a valid MongoDB ObjectId' })
  payGradeId?: string;



}
