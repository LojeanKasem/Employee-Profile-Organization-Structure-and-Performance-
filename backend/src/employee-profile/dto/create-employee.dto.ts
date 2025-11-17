// src/employee-profile/dto/create-employee.dto.ts
export class CreateEmployeeDto {
  employeeCode: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  nationalId?: string;
  dateOfBirth?: Date;
  hireDate?: Date;
  status?: 'ACTIVE' | 'INACTIVE' | 'TERMINATED';

  // Relations by id (Mongo ObjectId as string)
  departmentId?: string;
  positionId?: string;
  managerId?: string;
}
