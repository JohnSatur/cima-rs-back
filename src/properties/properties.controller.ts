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
import { FilterPropertiesDto } from './dto/filter-properties.dto';

@Controller('properties')
export class PropertiesController {
  constructor(private readonly propertiesService: PropertiesService) {}

  @Get('all')
  async getAllPropertiesForStatic(
    @Query('propertyType') propertyType?: string,
    @Query('city') city?: string,
    @Query('dealType') dealType?: string,
    @Query('minPrice') minPrice?: string,
    @Query('maxPrice') maxPrice?: string,
    @Query('minArea') minArea?: string,
    @Query('maxArea') maxArea?: string,
  ) {
    const filters = {
      propertyType,
      city,
      dealType,
      minPrice: minPrice ? Number(minPrice) : undefined,
      maxPrice: maxPrice ? Number(maxPrice) : undefined,
      minArea: minArea ? Number(minArea) : undefined,
      maxArea: maxArea ? Number(maxArea) : undefined,
    };

    return this.propertiesService.getAllPropertiesForStatic(filters);
  }

  @Get()
  async getAllProperties(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('type') type?: string,
    @Query('propertyType') propertyType?: string,
    @Query('city') city?: string,
    @Query('minPrice') minPrice?: string,
    @Query('maxPrice') maxPrice?: string,
    @Query('minLandArea') minLandArea?: string,
    @Query('maxLandArea') maxLandArea?: string,
    @Query('minConstructionArea') minConstructionArea?: string,
    @Query('maxConstructionArea') maxConstructionArea?: string,
    @Query('dealType') dealType?: string,
  ) {
    const filters = {
      type,
      propertyType,
      city,
      minPrice: minPrice ? Number(minPrice) : undefined,
      maxPrice: maxPrice ? Number(maxPrice) : undefined,
      minLandArea: minLandArea ? Number(minLandArea) : undefined,
      maxLandArea: maxLandArea ? Number(maxLandArea) : undefined,
      minConstructionArea: minConstructionArea
        ? Number(minConstructionArea)
        : undefined,
      maxConstructionArea: maxConstructionArea
        ? Number(maxConstructionArea)
        : undefined,
      dealType,
    };

    return this.propertiesService.getAllProperties(
      page ? Number(page) : 1,
      limit ? Number(limit) : 8,
      filters,
    );
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
