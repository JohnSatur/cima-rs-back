import {
  Controller,
  Post,
  Body,
  Get,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { PropertiesService } from './properties.service';
import { Construction } from './schemas/construction.schema';
import { CreateConstructionDto } from './dto/create-construction.dto';
import { CreateLandDto } from './dto/create-land.dto';
import { Land } from './schemas/land.schema';
import { UpdateConstructionDto } from './dto/update-construction.dto';
import { UpdateLandDto } from './dto/update-land.dto';
import { GetAllPropertiesQueryDto } from './dto/get-all-properties-query.dto';
import { FilterPropertiesDto } from './dto/filter-properties.dto';

@Controller('properties')
export class PropertiesController {
  constructor(private readonly propertiesService: PropertiesService) {}

  @Get()
  async getAllProperties(@Query() query: GetAllPropertiesQueryDto) {
    const { page = 1, limit = 8, type } = query;
    return this.propertiesService.getAllProperties(page, limit, type);
  }

  @Get('filter')
  async filterProperties(@Query() filters: FilterPropertiesDto) {
    return this.propertiesService.filterProperties(filters);
  }

  @Get(':id')
  async getPropertyById(@Param('id') id: string) {
    return this.propertiesService.getPropertyById(id);
  }

  @Delete(':id')
  async deleteProperty(@Param('id') id: string): Promise<{ message: string }> {
    return this.propertiesService.deleteProperty(id);
  }

  @Post('/constructions')
  async createConstruction(
    @Body() createConstructionDto: CreateConstructionDto,
  ): Promise<Construction> {
    return this.propertiesService.createConstruction(createConstructionDto);
  }

  @Patch('/constructions/:id')
  async updateConstruction(
    @Param('id') id: string,
    @Body() updateConstructionDto: UpdateConstructionDto,
  ): Promise<Construction> {
    return this.propertiesService.updateConstruction(id, updateConstructionDto);
  }

  @Post('/lands')
  async createLand(@Body() createLandDto: CreateLandDto): Promise<Land> {
    return this.propertiesService.createLand(createLandDto);
  }

  @Patch('/lands/:id')
  async updateLand(
    @Param('id') id: string,
    @Body() updateLandDto: UpdateLandDto,
  ): Promise<Land> {
    return this.propertiesService.updateLand(id, updateLandDto);
  }
}
