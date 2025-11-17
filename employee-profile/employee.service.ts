import { Injectable } from '@nestjs/common';
import { DepartmentService } from '../organization-structure/department.service';

@Injectable()
export class EmployeeService {
  constructor(private readonly departmentService: DepartmentService) {}

  getDummyEmployee() {
    const dept = this.departmentService.getDummyDepartment();

    return {
      id: 'emp-001',
      employeeCode: 'EMP1001',
      firstName: 'Sara',
      lastName: 'Youssef',
      email: 'sara.youssef@example.com',
      phone: '01012345678',
      hireDate: '2023-01-15',

      // 🔥 IMPORTANT:
      department: dept, // integration with org module
    };
  }
}
