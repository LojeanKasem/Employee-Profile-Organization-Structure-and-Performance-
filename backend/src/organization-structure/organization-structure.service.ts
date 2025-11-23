import { Injectable } from '@nestjs/common';
import { Department } from './models/department.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Position } from './models/position.schema';
import { StructureValidation } from './utils/structure.validation';
import { Model } from 'mongoose';
import {  NotFoundException } from '@nestjs/common';
import { Department, DepartmentDocument } from './models/department.schema';
import { Position, PositionDocument } from './models/position.schema';
import { BadRequestException,} from '@nestjs/common';

import { CreatePositionDto } from './dto/create-position.dto';
import { UpdatePositionDto } from './dto/update-position.dto';
import { CreateDepartmentDto } from './dto/create-department.dto';
import { UpdateDepartmentDto } from './dto/update-department.dto';
@Injectable()
export class OrganizationStructureService {
  constructor(
    @InjectModel(Department.name) private readonly departmentModel: Model<Department>,
    @InjectModel(Position.name) private readonly positionModel: Model<Position>,
    private readonly validation: StructureValidation        // <-- NEW 
  ) {}
  // -----------------------------------------
  // POSITIONS — TEST MODE (NO HOOKS)
  // -----------------------------------------
  // This avoids MissingSchemaError because schema pre-save hooks are skipped.

  async createPosition(dto: CreatePositionDto) {
    // Validate department exists
    const department = await this.departmentModel.findById(dto.departmentId);

    if (!department) {
      throw new NotFoundException('Department does not exist');
    }

    // DIRECT INSERT → skip hooks safely
    const inserted = await this.positionModel.collection.insertOne({
      ...dto,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    return {
      _id: inserted.insertedId,
      code: dto.code,
      title: dto.title,
      description: dto.description ?? null,
      departmentId: dto.departmentId,
      isActive: true,
    };
  }

  // GET ALL POSITIONS
  async getPositions() {
    return this.positionModel.find().exec();
  }

  // GET ONE POSITION
  async getPositionById(id: string) {
    const pos = await this.positionModel.findById(id).exec();

    if (!pos) {
      throw new NotFoundException('Position not found');
    }

    return pos;
  }

  // UPDATE POSITION (this uses update → hook may run but your schema's update hook is safe)
  async updatePosition(id: string, dto: UpdatePositionDto) {
    const updated = await this.positionModel.findByIdAndUpdate(
      id,
      dto,
      { new: true },
    );

    if (!updated) {
      throw new NotFoundException('Position not found');
    }

    return updated;
  }

  // DEACTIVATE POSITION
  async deactivatePosition(id: string) {
    const pos = await this.positionModel.findByIdAndUpdate(
      id,
      { isActive: false },
      { new: true },
    );

    if (!pos) {
      throw new NotFoundException('Position not found');
    }

    return pos;
  }
    // CREATE
  async createDepartment(dto: CreateDepartmentDto) {
    const exists = await this.departmentModel.findOne({ code: dto.code });
    if (exists) {
      throw new BadRequestException('Department code must be unique');
    }

    const department = new this.departmentModel(dto);
    return department.save();
  }

  // GET ALL
  async getAllDepartments() {
    return this.departmentModel.find();
  }

  // GET ONE
  async getDepartmentById(id: string) {
    const dep = await this.departmentModel.findById(id);
    if (!dep) {
      throw new NotFoundException('Department not found');
    }
    return dep;
  }

  // UPDATE
  async updateDepartment(id: string, dto: UpdateDepartmentDto) {
    const updated = await this.departmentModel.findByIdAndUpdate(
      id,
      dto,
      { new: true },
    );
    if (!updated) {
      throw new NotFoundException('Department not found');
    }
    return updated;
  }

  // DEACTIVATE
  async deactivateDepartment(id: string) {
    const dep = await this.departmentModel.findById(id);
    if (!dep) {
      throw new NotFoundException('Department not found');
    }

    dep.isActive = false;
    return dep.save();
  }
}

