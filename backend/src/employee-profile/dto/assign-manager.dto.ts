import { IsNotEmpty, IsString, IsMongoId } from 'class-validator';

export class AssignManagerDto {
  @IsNotEmpty({ message: 'Employee ID is required' })
  @IsString()
  @IsMongoId({ message: 'Employee ID must be a valid MongoDB ObjectId' })
  employeeId: string;

  @IsNotEmpty({ message: 'Manager ID is required' })
  @IsString()
  @IsMongoId({ message: 'Manager ID must be a valid MongoDB ObjectId' })
  managerId: string;
}

