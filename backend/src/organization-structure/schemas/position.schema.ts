import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Department } from './department.schema';

@Schema({ timestamps: true })
export class Position extends Document {
  @Prop({ required: true, unique: true })
  code: string; // e.g. "POS-001"

  @Prop({ required: true })
  title: string; // e.g. "HR Specialist"

  @Prop({ type: Types.ObjectId, ref: Department.name, required: true })
  department: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Position', default: null })
  reportsTo?: Types.ObjectId; // reporting line

  @Prop()
  payGrade?: string; // optional link to payroll grades

  @Prop({ default: false })
  isManager: boolean;

  @Prop({ default: true })
  isActive: boolean;
}

export const PositionSchema = SchemaFactory.createForClass(Position);
