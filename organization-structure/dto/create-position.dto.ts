// src/organization-structure/dto/create-position.dto.ts
export class CreatePositionDto {
  code: string;
  title: string;

  // Relations by id
  departmentId: string;       // required
  reportsToId?: string;       // optional

  payGrade?: string;
  isManager?: boolean;
  isActive?: boolean;
}
