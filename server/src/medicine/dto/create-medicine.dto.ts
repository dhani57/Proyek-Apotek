import {
  IsString,
  IsNumber,
  IsOptional,
  IsBoolean,
  IsDateString,
  Min,
} from 'class-validator';

/* eslint-disable @typescript-eslint/no-unsafe-call */
export class CreateMedicineDto {
  @IsString()
  @IsOptional()
  plu?: string; // Product Look Up code

  @IsString()
  name: string; // Item Name

  @IsString()
  @IsOptional()
  description?: string;

  @IsNumber()
  @Min(0)
  @IsOptional()
  purchasePrice?: number; // Purchase Price

  @IsNumber()
  @Min(0)
  sellPrice: number; // Sales Price

  @IsNumber()
  @Min(0)
  @IsOptional()
  buyPrice?: number; // Keep for backward compatibility

  @IsNumber()
  @Min(0)
  stock: number;

  @IsNumber()
  @Min(0)
  @IsOptional()
  stockMinimal?: number; // Stock Minimal

  @IsNumber()
  @Min(0)
  @IsOptional()
  stockMaximal?: number; // Stock Maximal

  @IsString()
  unit: string; // Unit Code

  @IsString()
  @IsOptional()
  unitCode?: string; // Unit Code (alias)

  @IsString()
  @IsOptional()
  purchaseUnitCode?: string; // Purchase Unit Code

  @IsNumber()
  @IsOptional()
  unitConversion?: number; // Unit Conversion

  @IsString()
  @IsOptional()
  status?: string; // Status (active/inactive)

  @IsString()
  @IsOptional()
  rackLocation?: string; // Rack Location

  @IsNumber()
  @IsOptional()
  margin?: number; // Margin

  @IsString()
  @IsOptional()
  onlineSku?: string; // Online SKU

  @IsString()
  @IsOptional()
  barcode?: string; // Barcode

  @IsString()
  @IsOptional()
  batchNumber?: string;

  @IsDateString()
  @IsOptional()
  expirationDate?: string;

  @IsString()
  @IsOptional()
  imageUrl?: string;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @IsString()
  @IsOptional()
  categoryId?: string; // Category ID

  @IsString()
  @IsOptional()
  category?: string; // Category Name (for auto-create)

  @IsString()
  @IsOptional()
  supplierId?: string; // Supplier ID
  
  @IsString()
  @IsOptional()
  supplier?: string; // Supplier Name (for auto-create)
}
