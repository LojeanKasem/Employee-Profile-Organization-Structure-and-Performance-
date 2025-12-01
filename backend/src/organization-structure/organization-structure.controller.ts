import {
  Controller,
  Post,
  Get,
  Patch,
  Param,
  Body,
  Delete,
  UseGuards,
} from '@nestjs/common';

import { OrganizationStructureService } from './organization-structure.service';

import { CreateDepartmentDto } from './dto/create-department.dto';
import { UpdateDepartmentDto } from './dto/update-department.dto';
import { CreatePositionDto } from './dto/create-position.dto';
import { UpdatePositionDto } from './dto/update-position.dto';
import { SetReportingLineDto } from './dto/set-reporting-line.dto';

// Guards + Roles
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { HR_ROLES, ADMIN_ROLES } from '../common/constants/role-groups';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('organization-structure')
export class OrganizationStructureController {
  constructor(private readonly service: OrganizationStructureService) {}

  // ========================================================================
  // DEPARTMENTS
  // ========================================================================

  @Post('departments')
  @Roles(...HR_ROLES, ...ADMIN_ROLES)
  createDepartment(@Body() dto: CreateDepartmentDto) {
    return this.service.createDepartment(dto);
  }

  @Get('departments')
  @Roles(...HR_ROLES, ...ADMIN_ROLES)
  getDepartments() {
    return this.service.getAllDepartments();
  }

  @Get('departments/:id')
  @Roles(...HR_ROLES, ...ADMIN_ROLES)
  getDepartment(@Param('id') id: string) {
    return this.service.getDepartmentById(id);
  }

  @Patch('departments/:id')
  @Roles(...HR_ROLES, ...ADMIN_ROLES)
  updateDepartment(@Param('id') id: string, @Body() dto: UpdateDepartmentDto) {
    return this.service.updateDepartment(id, dto);
  }

  @Delete('departments/:id')
  @Roles(...HR_ROLES, ...ADMIN_ROLES)
  deactivateDepartment(@Param('id') id: string) {
    return this.service.deactivateDepartment(id);
  }

  @Patch('departments/:id/activate')
  @Roles(...HR_ROLES, ...ADMIN_ROLES)
  activateDepartment(@Param('id') id: string) {
    return this.service.activateDepartment(id);
  }

  // ========================================================================
  // POSITIONS
  // ========================================================================

  @Post('positions')
  @Roles(...HR_ROLES, ...ADMIN_ROLES)
  createPosition(@Body() dto: CreatePositionDto) {
    return this.service.createPosition(dto);
  }

  @Get('positions')
  @Roles(...HR_ROLES, ...ADMIN_ROLES)
  getPositions() {
    return this.service.getPositions();
  }

  @Get('positions/:id')
  @Roles(...HR_ROLES, ...ADMIN_ROLES)
  getPosition(@Param('id') id: string) {
    return this.service.getPositionById(id);
  }

  @Patch('positions/:id')
  @Roles(...HR_ROLES, ...ADMIN_ROLES)
  updatePosition(@Param('id') id: string, @Body() dto: UpdatePositionDto) {
    return this.service.updatePosition(id, dto);
  }

  @Delete('positions/:id')
  @Roles(...HR_ROLES, ...ADMIN_ROLES)
  deactivatePosition(@Param('id') id: string) {
    return this.service.deactivatePosition(id);
  }

  @Patch('positions/:id/activate')
  @Roles(...HR_ROLES, ...ADMIN_ROLES)
  activatePosition(@Param('id') id: string) {
    return this.service.activatePosition(id);
  }

  // ========================================================================
  // REPORTING LINES
  // ========================================================================

  @Patch('positions/:id/report-to')
@Roles(...HR_ROLES, ...ADMIN_ROLES)
setReportingLine(
  @Param('id') id: string,
  @Body() dto: SetReportingLineDto,
) {
  return this.service.setReportingLine(id, dto.reportsToPositionId);
}


  @Patch('positions/:id/remove-report-to')
  @Roles(...HR_ROLES, ...ADMIN_ROLES)
  removeReportingLine(@Param('id') id: string) {
    return this.service.removeReportingLine(id);
  }

  @Get('positions/:id/manager')
  @Roles(...HR_ROLES, ...ADMIN_ROLES)
  getManagerOfPosition(@Param('id') id: string) {
    return this.service.getManagerOfPosition(id);
  }

  @Get('departments/:id/positions')
  @Roles(...HR_ROLES, ...ADMIN_ROLES)
  getPositionsInDepartment(@Param('id') id: string) {
    return this.service.getPositionsInDepartment(id);
  }
}
