import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { EmployeeProfileModule } from './employee-profile/employee-profile.module';
import { OrganizationStructureModule } from './organization-structure/organization-structure.module';
import { PerformanceModule } from './performance/performance.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),

   MongooseModule.forRoot(process.env.MONGODB_URI || ''),


    EmployeeProfileModule,
    OrganizationStructureModule,
    PerformanceModule,
  ],
})
export class AppModule {}
