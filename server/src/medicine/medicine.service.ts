import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateMedicineDto } from './dto/create-medicine.dto';
import { UpdateMedicineDto } from './dto/update-medicine.dto';
import * as XLSX from 'xlsx';

@Injectable()
export class MedicineService {
  constructor(private prisma: PrismaService) {}

  async create(createMedicineDto: CreateMedicineDto) {
    // Ensure we have a valid categoryId
    if (!createMedicineDto.categoryId) {
      throw new Error('CategoryId is required');
    }

    return this.prisma.product.create({
      data: {
        plu: createMedicineDto.plu,
        name: createMedicineDto.name,
        description: createMedicineDto.description,
        purchasePrice:
          createMedicineDto.purchasePrice ?? createMedicineDto.buyPrice ?? 0,
        sellPrice: createMedicineDto.sellPrice,
        buyPrice:
          createMedicineDto.buyPrice ?? createMedicineDto.purchasePrice ?? 0,
        stock: createMedicineDto.stock,
        stockMinimal: createMedicineDto.stockMinimal,
        stockMaximal: createMedicineDto.stockMaximal,
        unit: createMedicineDto.unit,
        unitCode: createMedicineDto.unitCode,
        purchaseUnitCode: createMedicineDto.purchaseUnitCode,
        unitConversion: createMedicineDto.unitConversion,
        rackLocation: createMedicineDto.rackLocation,
        margin: createMedicineDto.margin,
        onlineSku: createMedicineDto.onlineSku,
        barcode: createMedicineDto.barcode,
        batchNumber: createMedicineDto.batchNumber,
        expirationDate: createMedicineDto.expirationDate,
        imageUrl: createMedicineDto.imageUrl,
        categoryId: createMedicineDto.categoryId,
        supplierId: createMedicineDto.supplierId,
        isActive:
          createMedicineDto.status === 'Aktif' ||
          createMedicineDto.status === 'active' ||
          createMedicineDto.isActive !== false,
      },
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

    // Cache untuk kategori dan supplier yang sudah dibuat
    const categoryCache = new Map<string, string>();
    const supplierCache = new Map<string, string>();

    for (const medicine of medicines) {
      try {
        let categoryId = medicine.categoryId;
        let supplierId = medicine.supplierId;

        // Auto-create category jika tidak ada categoryId tapi ada nama kategori
        if (!categoryId && medicine.category) {
          const categoryName = String(medicine.category);

          // Cek cache dulu
          if (categoryCache.has(categoryName)) {
            categoryId = categoryCache.get(categoryName);
          } else {
            // Cari atau buat kategori baru
            let category = await this.prisma.category.findFirst({
              where: {
                name: { equals: categoryName, mode: 'insensitive' },
              },
            });

            if (!category) {
              category = await this.prisma.category.create({
                data: { name: categoryName },
              });
            }

            categoryId = category.id;
            categoryCache.set(categoryName, categoryId);
          }
        }

        // Auto-create supplier jika tidak ada supplierId tapi ada nama supplier
        if (!supplierId && medicine.supplier) {
          const supplierName = String(medicine.supplier);

          // Cek cache dulu
          if (supplierCache.has(supplierName)) {
            supplierId = supplierCache.get(supplierName);
          } else {
            // Cari atau buat supplier baru
            let supplier = await this.prisma.supplier.findFirst({
              where: {
                name: { equals: supplierName, mode: 'insensitive' },
              },
            });

            if (!supplier) {
              supplier = await this.prisma.supplier.create({
                data: {
                  name: supplierName,
                  email: `${supplierName.toLowerCase().replace(/\s+/g, '_')}@supplier.com`,
                  phone: '-',
                  address: '-',
                },
              });
            }

            supplierId = supplier.id;
            supplierCache.set(supplierName, supplierId);
          }
        }

        // Ensure categoryId is set (either from medicine or from auto-create)
        if (!categoryId) {
          throw new Error('CategoryId is required');
        }

        const created = await this.prisma.product.create({
          data: {
            plu: medicine.plu,
            name: medicine.name,
            description: medicine.description,
            purchasePrice: medicine.purchasePrice ?? medicine.buyPrice ?? 0,
            sellPrice: medicine.sellPrice,
            buyPrice: medicine.buyPrice ?? medicine.purchasePrice ?? 0,
            stock: medicine.stock,
            stockMinimal: medicine.stockMinimal,
            stockMaximal: medicine.stockMaximal,
            unit: medicine.unit,
            unitCode: medicine.unitCode,
            purchaseUnitCode: medicine.purchaseUnitCode,
            unitConversion: medicine.unitConversion,
            rackLocation: medicine.rackLocation,
            margin: medicine.margin,
            onlineSku: medicine.onlineSku,
            barcode: medicine.barcode,
            batchNumber: medicine.batchNumber,
            expirationDate: medicine.expirationDate,
            imageUrl: medicine.imageUrl,
            categoryId,
            supplierId,
            isActive:
              medicine.status === 'Aktif' ||
              medicine.status === 'active' ||
              medicine.isActive !== false,
          },
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
      data: {
        plu: updateMedicineDto.plu,
        name: updateMedicineDto.name,
        description: updateMedicineDto.description,
        purchasePrice: updateMedicineDto.purchasePrice,
        sellPrice: updateMedicineDto.sellPrice,
        buyPrice: updateMedicineDto.buyPrice,
        stock: updateMedicineDto.stock,
        stockMinimal: updateMedicineDto.stockMinimal,
        stockMaximal: updateMedicineDto.stockMaximal,
        unit: updateMedicineDto.unit,
        unitCode: updateMedicineDto.unitCode,
        purchaseUnitCode: updateMedicineDto.purchaseUnitCode,
        unitConversion: updateMedicineDto.unitConversion,
        rackLocation: updateMedicineDto.rackLocation,
        margin: updateMedicineDto.margin,
        onlineSku: updateMedicineDto.onlineSku,
        barcode: updateMedicineDto.barcode,
        batchNumber: updateMedicineDto.batchNumber,
        expirationDate: updateMedicineDto.expirationDate,
        imageUrl: updateMedicineDto.imageUrl,
        categoryId: updateMedicineDto.categoryId,
        supplierId: updateMedicineDto.supplierId,
        ...(updateMedicineDto.status && {
          isActive:
            updateMedicineDto.status === 'Aktif' ||
            updateMedicineDto.status === 'active',
        }),
        ...(updateMedicineDto.isActive !== undefined && {
          isActive: updateMedicineDto.isActive,
        }),
      },
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
      'No',
      'PLU',
      'Item Name',
      'Purchase Price',
      'Sales Price',
      'Stock',
      'Stock Minimal',
      'Stock Maximal',
      'Unit Code',
      'Purchase Unit Code',
      'Unit Conversion',
      'Status',
      'Rack Location',
      'Margin',
      'Online SKU',
      'Barcode',
      'Category',
      'Supplier',
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
      med.supplier?.name || '',
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map((row) =>
        row
          .map((cell) => {
            const cellStr = String(cell);
            // Escape commas and quotes in CSV
            if (
              cellStr.includes(',') ||
              cellStr.includes('"') ||
              cellStr.includes('\n')
            ) {
              return `"${cellStr.replace(/"/g, '""')}"`;
            }
            return cellStr;
          })
          .join(','),
      ),
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
      No: index + 1,
      PLU: med.plu || '',
      'Item Name': med.name,
      'Purchase Price': Number(med.purchasePrice || med.buyPrice || 0),
      'Sales Price': Number(med.sellPrice || 0),
      Stock: med.stock,
      'Stock Minimal': med.stockMinimal || '',
      'Stock Maximal': med.stockMaximal || '',
      'Unit Code': med.unitCode || med.unit,
      'Purchase Unit Code': med.purchaseUnitCode || '',
      'Unit Conversion': Number(med.unitConversion || 0),
      Status: med.status || 'active',
      'Rack Location': med.rackLocation || '',
      Margin: Number(med.margin || 0),
      'Online SKU': med.onlineSku || '',
      Barcode: med.barcode || '',
      Category: med.category?.name || '',
      Supplier: med.supplier?.name || '',
    }));

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Medicines');

    // Generate buffer
    const buffer = XLSX.write(workbook, {
      type: 'buffer',
      bookType: 'xlsx',
    }) as Buffer;
    return buffer;
  }
}
