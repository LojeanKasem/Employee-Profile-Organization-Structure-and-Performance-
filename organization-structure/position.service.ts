import { Injectable } from '@nestjs/common';
import { DepartmentService } from './department.service';

@Injectable()
export class PositionService {
  constructor(private departmentService: DepartmentService) {}

  getDummyPosition() {
    const dept = this.departmentService.getDummyDepartment();

    return {
      id: 'pos-001',
      code: 'POS-HR-1',
      title: 'HR Specialist',
      department: dept,
      reportsTo: null,
      payGrade: 'PG5',
      isActive: true,
    };
  }
}
