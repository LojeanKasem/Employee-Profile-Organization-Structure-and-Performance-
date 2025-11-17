// src/performance/dto/create-performance-appraisal.dto.ts
export class CreatePerformanceAppraisalDto {
  employeeId: string; // Employee being evaluated
  managerId: string;  // Manager doing the evaluation
  cycleId: string;    // PerformanceCycle

  ratings?: {
    criterion: string;
    score: number;
    comment?: string;
  }[];

  overallRating?: number;
  managerComment?: string;
  employeeComment?: string;
  status?: string; // 'DRAFT' | 'SUBMITTED' | 'PUBLISHED' | ...
}
