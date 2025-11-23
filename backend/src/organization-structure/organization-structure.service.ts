import { Injectable } from '@nestjs/common';
import { Department } from './models/department.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Position } from './models/position.schema';
import { StructureValidation } from './utils/structure.validation';
import { Model } from 'mongoose';

@Injectable()
export class OrganizationStructureService {
  constructor(
    @InjectModel(Department.name) private readonly departmentModel: Model<Department>,
    @InjectModel(Position.name) private readonly positionModel: Model<Position>,
    private readonly validation: StructureValidation        // <-- NEW 
  ) {}
}

