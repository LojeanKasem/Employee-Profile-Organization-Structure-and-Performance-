import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Employee } from '../../employee-profile/schemas/employee.schema';
import { PerformanceCycle } from './performance-cycle.schema';

@Schema({ timestamps: true })
export class PerformanceAppraisal extends Document {
  @Prop({ type: Types.ObjectId, ref: Employee.name, required: true })
  employee: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: Employee.name, required: true })
  manager: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: PerformanceCycle.name, required: true })
  cycle: Types.ObjectId;

  @Prop({
    type: [
      {
        criterion: String,
        score: Number,
        comment: String,
      },
    ],
    default: [],
  })
  ratings: { criterion: string; score: number; comment?: string }[];

  @Prop({ type: Number })
  overallRating?: number;

  @Prop()
  managerComment?: string;

  @Prop()
  employeeComment?: string;

  @Prop({ default: 'DRAFT' })
  status: string; // DRAFT, SUBMITTED, PUBLISHED, DISPUTED, CLOSED

  @Prop()
  disputeReason?: string;

  @Prop()
  disputeResolution?: string;
}

export const PerformanceAppraisalSchema =
  SchemaFactory.createForClass(PerformanceAppraisal);
