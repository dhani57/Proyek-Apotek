import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateMedicineDto } from './dto/create-medicine.dto';
import { UpdateMedicineDto } from './dto/update-medicine.dto';
import * as XLSX from 'xlsx';

@Injectable()
export class MedicineService {
  constructor(private prisma: PrismaService) {}

  async create(createMedicineDto: CreateMedicineDto) {
    // Set buyPrice = purchasePrice if not provided for backward compatibility
    const data = {
      ...createMedicineDto,
      buyPrice: createMedicineDto.buyPrice ?? createMedicineDto.purchasePrice ?? 0,
      purchasePrice: createMedicineDto.purchasePrice ?? createMedicineDto.buyPrice ?? 0,
    };
    
    return this.prisma.product.create({
      data,
      include: {
        category: true,
        supplier: true,
      },
    });
  }

  async bulkCreate(medicines: CreateMedicineDto[]) {
    const results = {
      success: [] as any[],
      failed: [] as any[],
    };

    for (const medicine of medicines) {
      try {
        // Set buyPrice = purchasePrice if not provided
        const data = {
          ...medicine,
          buyPrice: medicine.buyPrice ?? medicine.purchasePrice ?? 0,
          purchasePrice: medicine.purchasePrice ?? medicine.buyPrice ?? 0,
        };
        
        const created = await this.prisma.product.create({
          data,
          include: {
            category: true,
            supplier: true,
          },
        });
        results.success.push(created);
      } catch (error) {
        results.failed.push({
          medicine,
          error: error instanceof Error ? error.message : 'Unknown error',
        });
      }
    }

    return results;
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

  async exportToCSV(): Promise<string> {
    const medicines = await this.prisma.product.findMany({
      include: {
        category: true,
        supplier: true,
      },
      orderBy: {
        name: 'asc',
      },
    });

    // Define 18 columns according to the image
    const headers = [
      'No', 'PLU', 'Item Name', 'Purchase Price', 'Sales Price', 'Stock',
      'Stock Minimal', 'Stock Maximal', 'Unit Code', 'Purchase Unit Code',
      'Unit Conversion', 'Status', 'Rack Location', 'Margin', 'Online SKU',
      'Barcode', 'Category', 'Supplier'
    ];

    const rows = medicines.map((med, index) => [
      index + 1,
      med.plu || '',
      med.name,
      med.purchasePrice?.toString() || med.buyPrice?.toString() || '0',
      med.sellPrice?.toString() || '0',
      med.stock,
      med.stockMinimal || '',
      med.stockMaximal || '',
      med.unitCode || med.unit,
      med.purchaseUnitCode || '',
      med.unitConversion?.toString() || '',
      med.status || 'active',
      med.rackLocation || '',
      med.margin?.toString() || '',
      med.onlineSku || '',
      med.barcode || '',
      med.category?.name || '',
      med.supplier?.name || ''
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => {
        const cellStr = String(cell);
        // Escape commas and quotes in CSV
        if (cellStr.includes(',') || cellStr.includes('"') || cellStr.includes('\n')) {
          return `"${cellStr.replace(/"/g, '""')}"`;
        }
        return cellStr;
      }).join(','))
    ].join('\n');

    return csvContent;
  }

  async exportToExcel(): Promise<Buffer> {
    const medicines = await this.prisma.product.findMany({
      include: {
        category: true,
        supplier: true,
      },
      orderBy: {
        name: 'asc',
      },
    });

    // Define 18 columns according to the image
    const data = medicines.map((med, index) => ({
      'No': index + 1,
      'PLU': med.plu || '',
      'Item Name': med.name,
      'Purchase Price': Number(med.purchasePrice || med.buyPrice || 0),
      'Sales Price': Number(med.sellPrice || 0),
      'Stock': med.stock,
      'Stock Minimal': med.stockMinimal || '',
      'Stock Maximal': med.stockMaximal || '',
      'Unit Code': med.unitCode || med.unit,
      'Purchase Unit Code': med.purchaseUnitCode || '',
      'Unit Conversion': Number(med.unitConversion || 0),
      'Status': med.status || 'active',
      'Rack Location': med.rackLocation || '',
      'Margin': Number(med.margin || 0),
      'Online SKU': med.onlineSku || '',
      'Barcode': med.barcode || '',
      'Category': med.category?.name || '',
      'Supplier': med.supplier?.name || ''
    }));

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Medicines');

    // Generate buffer
    const buffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });
    return buffer;
  }
}
