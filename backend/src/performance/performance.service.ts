import { Injectable } from '@nestjs/common';
import { EmployeeService } from '../employee-profile/employee.service';

@Injectable()
export class PerformanceService {
  constructor(private readonly employeeService: EmployeeService) {}

  getDummyPerformance() {
    const employee = this.employeeService.getDummyEmployee();

    return {
      id: 'app-001',
      cycleName: 'Annual Appraisal 2025',
      employee: employee,
      overallRating: 4.8,
      managerComment: 'Excellent work throughout the year.',
      status: 'PUBLISHED',
    };
  }
}
