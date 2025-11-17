import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class PerformanceTemplate extends Document {
  @Prop({ required: true })
  name: string; // e.g. "Annual Appraisal 2025"

  @Prop({ required: true })
  type: string; // "annual", "probation", etc.

  @Prop()
  description?: string;

  @Prop({ default: true })
  isActive: boolean;

  @Prop({
    type: [
      {
        name: String,
        weight: Number,
        description: String,
      },
    ],
    default: [],
  })
  criteria: { name: string; weight: number; description?: string }[];
}

export const PerformanceTemplateSchema =
  SchemaFactory.createForClass(PerformanceTemplate);
