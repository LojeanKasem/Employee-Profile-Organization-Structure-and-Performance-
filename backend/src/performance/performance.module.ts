import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PerformanceService } from './performance.service';
import { PerformanceController } from './performance.controller';
import { PerformanceTemplate, PerformanceTemplateSchema } from './schemas/performance-template.schema';
import { PerformanceCycle, PerformanceCycleSchema } from './schemas/performance-cycle.schema';
import { PerformanceAppraisal, PerformanceAppraisalSchema } from './schemas/performance-appraisal.schema';
import { EmployeeProfileModule } from '../employee-profile/employee-profile.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: PerformanceTemplate.name, schema: PerformanceTemplateSchema },
      { name: PerformanceCycle.name, schema: PerformanceCycleSchema },
      { name: PerformanceAppraisal.name, schema: PerformanceAppraisalSchema },
    ]),
    forwardRef(() => EmployeeProfileModule),
  ],
  controllers: [PerformanceController],
  providers: [PerformanceService],
})
export class PerformanceModule {}
