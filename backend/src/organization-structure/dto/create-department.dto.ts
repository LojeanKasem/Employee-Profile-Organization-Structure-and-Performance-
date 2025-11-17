// src/organization-structure/dto/create-department.dto.ts
export class CreateDepartmentDto {
  code: string;
  name: string;
  costCenter?: string;
  isActive?: boolean;
}
