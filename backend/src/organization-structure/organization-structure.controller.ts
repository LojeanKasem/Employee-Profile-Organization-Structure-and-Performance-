import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { HierarchyService } from './hierarchy/hierarchy.service';
import { OrganizationStructureService } from './organization-structure.service';
import { CreateDepartmentDto } from './dto/create-department.dto';
import { UpdateDepartmentDto } from './dto/update-department.dto';
@Controller('organization-structure')
export class OrganizationStructureController {
  constructor(
    private readonly organizationStructureService: OrganizationStructureService,
    private readonly hierarchyService: HierarchyService,
  ) {}

  // 🔹 Full org hierarchy (all departments + trees of positions)
  @Get('hierarchy')
  getOrganizationHierarchy() {
    return this.hierarchyService.getOrgHierarchy();
  }

  // 🔹 Hierarchy for a single position (that position as a node + its children)
  @Get('positions/:id/hierarchy')
  getPositionHierarchy(@Param('id') id: string) {
    return this.hierarchyService.getPositionHierarchy(id);
  }
  // 🔥 TEMPORARY VALIDATION TEST ENDPOINT
  @Get('validation/test/:id')
  async testValidation(@Param('id') id: string) {
    try {
      const result = await this.hierarchyService['validation']?.validateObjectId(id); // just a quick test
      return { message: "VALID OBJECT ID", id };
    } catch (error) {
      return error;
    }
  }
    // CREATE DEPARTMENT
  @Post('departments')
  createDepartment(@Body() dto: CreateDepartmentDto) {
    return this.orgService.createDepartment(dto);
  }

  // GET ALL
  @Get('departments')
  getAllDepartments() {
    return this.orgService.getAllDepartments();
  }

  // GET SINGLE
  @Get('departments/:id')
  getDepartment(@Param('id') id: string) {
    return this.orgService.getDepartmentById(id);
  }

  // UPDATE
  @Patch('departments/:id')
  updateDepartment(
    @Param('id') id: string,
    @Body() dto: UpdateDepartmentDto,
  ) {
    return this.orgService.updateDepartment(id, dto);
  }

  // DEACTIVATE
  @Patch('departments/deactivate/:id')
  deactivateDepartment(@Param('id') id: string) {
    return this.orgService.deactivateDepartment(id);
  }

}
