
import { HierarchyService } from './hierarchy/hierarchy.service';
import { OrganizationStructureService } from './organization-structure.service';
import { 
  Controller,
  Post,
  Get,
  Patch,
  Body,
  Param 
} from '@nestjs/common';


import { CreatePositionDto } from './dto/create-position.dto';
import { UpdatePositionDto } from './dto/update-position.dto';

  

@Controller('organization-structure')
export class OrganizationStructureController {
  constructor(
    private readonly orgService: OrganizationStructureService ,
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
  // -----------------------------------------
// POSITIONS
// -----------------------------------------

@Post('positions')
createPosition(@Body() dto: CreatePositionDto) {
  return this.orgService.createPosition(dto);
}

@Get('positions')
getPositions() {
  return this.orgService.getPositions();
}

@Get('positions/:id')
getPosition(@Param('id') id: string) {
  return this.orgService.getPositionById(id);
}

@Patch('positions/:id')
updatePosition(
  @Param('id') id: string,
  @Body() dto: UpdatePositionDto,
) {
  return this.orgService.updatePosition(id, dto);
}

@Patch('positions/:id/deactivate')
deactivatePosition(@Param('id') id: string) {
  return this.orgService.deactivatePosition(id);
}
}
