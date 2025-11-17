import { Controller, Get } from '@nestjs/common';
import { DepartmentService } from './department.service';

@Controller('departments')
export class DepartmentController {
  constructor(private readonly departmentService: DepartmentService) {}

  @Get('dummy')
  getDummy() {
    return this.departmentService.getDummyDepartment();
  }
}
