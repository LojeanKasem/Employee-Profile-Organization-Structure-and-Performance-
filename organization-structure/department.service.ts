import { Injectable } from '@nestjs/common';

@Injectable()
export class DepartmentService {
  getDummyDepartment() {
    return {
      id: 'dept-001',
      code: 'HR',
      name: 'Human Resources',
      costCenter: 'CC1001',
      isActive: true,
    };
  }
}
