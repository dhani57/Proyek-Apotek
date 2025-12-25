import { IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { CreateMedicineDto } from './create-medicine.dto';

export class BulkImportMedicineDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateMedicineDto)
  medicines: CreateMedicineDto[];
}
