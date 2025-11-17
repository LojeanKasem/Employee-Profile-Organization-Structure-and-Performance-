import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Department extends Document {
  @Prop({ required: true, unique: true })
  code: string; // e.g. "HR", "FIN"

  @Prop({ required: true })
  name: string; // e.g. "Human Resources"

  @Prop()
  costCenter?: string; // optional, for finance link

  @Prop({ default: true })
  isActive: boolean;
}

export const DepartmentSchema = SchemaFactory.createForClass(Department);
