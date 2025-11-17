// src/performance/dto/create-performance-template.dto.ts
export class CreatePerformanceTemplateDto {
  name: string;
  type: string; // e.g. 'ANNUAL', 'PROBATION'
  description?: string;

  // Simple criteria representation
  criteria?: {
    name: string;
    weight?: number;
    description?: string;
  }[];
}
