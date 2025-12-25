import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
} from '@nestjs/common';
import { MedicineService } from './medicine.service';
import { CreateMedicineDto } from './dto/create-medicine.dto';
import { UpdateMedicineDto } from './dto/update-medicine.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('medicines')
@UseGuards(JwtAuthGuard)
export class MedicineController {
  constructor(private readonly medicineService: MedicineService) {}

  @Post()
  @UseGuards(RolesGuard)
  @Roles('ADMIN')
  create(@Body() createMedicineDto: CreateMedicineDto) {
    return this.medicineService.create(createMedicineDto);
  }

  @Get()
  findAll() {
    return this.medicineService.findAll();
  }

  @Get('statistics')
  @UseGuards(RolesGuard)
  @Roles('ADMIN')
  getStatistics() {
    return this.medicineService.getStatistics();
  }

  @Get('low-stock')
  @UseGuards(RolesGuard)
  @Roles('ADMIN')
  getLowStock(@Query('threshold') threshold?: string) {
    return this.medicineService.getLowStock(threshold ? parseInt(threshold) : 10);
  }

  @Get('expiring')
  @UseGuards(RolesGuard)
  @Roles('ADMIN')
  getExpiringMedicines(@Query('months') months?: string) {
    return this.medicineService.getExpiringMedicines(months ? parseInt(months) : 3);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.medicineService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(RolesGuard)
  @Roles('ADMIN')
  update(@Param('id') id: string, @Body() updateMedicineDto: UpdateMedicineDto) {
    return this.medicineService.update(id, updateMedicineDto);
  }

  @Delete(':id')
  @UseGuards(RolesGuard)
  @Roles('ADMIN')
  remove(@Param('id') id: string) {
    return this.medicineService.remove(id);
  }
}
