import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateMedicineDto } from './dto/create-medicine.dto';
import { UpdateMedicineDto } from './dto/update-medicine.dto';

@Injectable()
export class MedicineService {
  constructor(private prisma: PrismaService) {}

  async create(createMedicineDto: CreateMedicineDto) {
    return this.prisma.product.create({
      data: createMedicineDto,
      include: {
        category: true,
      },
    });
  }

  async findAll() {
    return this.prisma.product.findMany({
      include: {
        category: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findOne(id: string) {
    const medicine = await this.prisma.product.findUnique({
      where: { id },
      include: {
        category: true,
      },
    });

    if (!medicine) {
      throw new NotFoundException('Medicine not found');
    }

    return medicine;
  }

  async update(id: string, updateMedicineDto: UpdateMedicineDto) {
    await this.findOne(id); // Check if exists

    return this.prisma.product.update({
      where: { id },
      data: updateMedicineDto,
      include: {
        category: true,
      },
    });
  }

  async remove(id: string) {
    await this.findOne(id); // Check if exists

    return this.prisma.product.delete({
      where: { id },
    });
  }

  async getLowStock(threshold: number = 10) {
    return this.prisma.product.findMany({
      where: {
        stock: {
          lte: threshold,
        },
        isActive: true,
      },
      include: {
        category: true,
      },
      orderBy: {
        stock: 'asc',
      },
    });
  }

  async getExpiringMedicines(months: number = 3) {
    const threeMonthsFromNow = new Date();
    threeMonthsFromNow.setMonth(threeMonthsFromNow.getMonth() + months);

    return this.prisma.product.findMany({
      where: {
        expirationDate: {
          lte: threeMonthsFromNow,
          gte: new Date(),
        },
        isActive: true,
      },
      include: {
        category: true,
      },
      orderBy: {
        expirationDate: 'asc',
      },
    });
  }

  async getStatistics() {
    const totalMedicines = await this.prisma.product.count({
      where: { isActive: true },
    });

    const lowStockCount = await this.prisma.product.count({
      where: {
        stock: { lte: 10 },
        isActive: true,
      },
    });

    const expiringCount = await this.prisma.product.count({
      where: {
        expirationDate: {
          lte: new Date(new Date().setMonth(new Date().getMonth() + 3)),
          gte: new Date(),
        },
        isActive: true,
      },
    });

    return {
      totalMedicines,
      lowStockCount,
      expiringCount,
    };
  }
}
