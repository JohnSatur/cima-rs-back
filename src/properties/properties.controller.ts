import {
  Controller,
  Post,
  Body,
  Get,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';

import { PropertiesService } from './properties.service';
import { Construction } from './schemas/construction.schema';
import { CreateConstructionDto } from './dto/create-construction.dto';
import { CreateLandDto } from './dto/create-land.dto';
import { Land } from './schemas/land.schema';
import { UpdateConstructionDto } from './dto/update-construction.dto';

@Controller('properties')
export class PropertiesController {
  constructor(private readonly propertiesService: PropertiesService) {}

  @Get('/constructions')
  async getAllConstructions() {
    return this.propertiesService.getAllConstructions();
  }

  @Get('/constructions/:id')
  async getConstructionById(@Param('id') id: string): Promise<Construction> {
    return this.propertiesService.getConstructionById(id);
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

  @Delete('/constructions/:id')
  async deleteConstruction(
    @Param('id') id: string,
  ): Promise<{ message: string }> {
    return this.propertiesService.deleteConstruction(id);
  }

  @Get('/lands')
  async getAllLands(): Promise<Land[]> {
    return this.propertiesService.getAllLands();
  }

  @Get('/lands/:id')
  async getLandById(@Param('id') id: string): Promise<Land> {
    return this.propertiesService.getLandById(id);
  }

  @Post('/lands')
  async createLand(@Body() createLandDto: CreateLandDto): Promise<Land> {
    return this.propertiesService.createLand(createLandDto);
  }

  @Patch('/lands/:id')
  async updateLand(
    @Param('id') id: string,
    @Body() updateLandDto: CreateLandDto,
  ): Promise<Land> {
    return this.propertiesService.updateLand(id, updateLandDto);
  }

  @Delete('/lands/:id')
  async deleteLand(@Param('id') id: string): Promise<{ message: string }> {
    return this.propertiesService.deleteLand(id);
  }
}
