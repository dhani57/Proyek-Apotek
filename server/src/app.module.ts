import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { MedicineModule } from './medicine/medicine.module';
import { TransactionModule } from './transaction/transaction.module';
import { PrismaService } from './prisma/prisma.service';

@Module({
  imports: [AuthModule, MedicineModule, TransactionModule],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule {}
