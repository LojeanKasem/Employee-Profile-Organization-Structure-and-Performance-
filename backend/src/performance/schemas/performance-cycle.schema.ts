import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { PerformanceTemplate } from './performance-template.schema';
import { Department } from '../../organization-structure/schemas/department.schema';

@Schema({ timestamps: true })
export class PerformanceCycle extends Document {
  @Prop({ required: true })
  name: string; // e.g. "Annual 2025"

  @Prop({ type: Date, required: true })
  startDate: Date;

  @Prop({ type: Date, required: true })
  endDate: Date;

  @Prop({ type: Types.ObjectId, ref: PerformanceTemplate.name, required: true })
  template: Types.ObjectId;

  @Prop({ default: 'OPEN' })
  status: string; // "OPEN", "CLOSED", etc.

  @Prop({ type: [{ type: Types.ObjectId, ref: Department.name }], default: [] })
  applicableDepartments: Types.ObjectId[];
}

export const PerformanceCycleSchema =
  SchemaFactory.createForClass(PerformanceCycle);
