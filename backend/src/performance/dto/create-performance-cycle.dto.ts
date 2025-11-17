// src/performance/dto/create-performance-cycle.dto.ts
export class CreatePerformanceCycleDto {
  name: string;
  startDate: Date;
  endDate: Date;

  templateId: string; // ref to PerformanceTemplate

  // Departments this cycle applies to
  applicableDepartmentIds?: string[];

  status?: string; // e.g. 'PLANNED', 'ACTIVE', 'CLOSED'
}
