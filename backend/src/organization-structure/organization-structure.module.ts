import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Department, DepartmentSchema } from './schemas/department.schema';
import { Position, PositionSchema } from './schemas/position.schema';
import { DepartmentService } from './department.service';
import { PositionService } from './position.service'; 

import { DepartmentController } from './department.controller';
import { PositionController } from './position.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Department.name, schema: DepartmentSchema },
      { name: Position.name, schema: PositionSchema },
    ]),
  ],
  controllers: [DepartmentController,
    PositionController],
  providers: [DepartmentService, PositionService],
  exports: [DepartmentService, PositionService],
})
export class OrganizationStructureModule {}
