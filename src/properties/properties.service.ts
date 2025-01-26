import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateConstructionDto } from './dto/create-construction.dto';
import { Construction } from './schemas/construction.schema';
import { Land } from './schemas/land.schema';
import { CreateLandDto } from './dto/create-land.dto';
import { UpdateConstructionDto } from './dto/update-construction.dto';

@Injectable()
export class PropertiesService {
  constructor(
    @InjectModel(Land.name) private readonly landModel: Model<Land>,
    @InjectModel(Construction.name)
    private readonly constructionModel: Model<Construction>,
  ) {}

  async createConstruction(createConstructionDto: CreateConstructionDto) {
    const construction = new this.constructionModel(createConstructionDto);
    return construction.save();
  }

  async getAllConstructions() {
    return this.constructionModel.find().exec();
  }

  async getConstructionById(id: string): Promise<Construction> {
    const construction = this.constructionModel.findById(id).exec();
    if (!construction)
      throw new NotFoundException(`Construction with ID ${id} not found`);
    return construction;
  }

  async updateConstruction(
    id: string,
    updateConstructionDto: UpdateConstructionDto,
  ): Promise<Construction> {
    return this.constructionModel
      .findByIdAndUpdate(id, updateConstructionDto, { new: true })
      .exec();
  }

  async deleteConstruction(id: string): Promise<{ message: string }> {
    const result = await this.constructionModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException(`Construction with ID ${id} not found`);
    }
    return { message: `Construction with ID ${id} has been deleted` };
  }

  async createLand(createLandDto: CreateLandDto) {
    const land = new this.landModel(createLandDto);
    return land.save();
  }

  async getAllLands() {
    return this.landModel.find().exec();
  }

  async getLandById(id: string): Promise<Land> {
    return this.landModel.findById(id).exec();
  }

  async updateLand(id: string, updateLandDto: CreateLandDto): Promise<Land> {
    return this.landModel
      .findByIdAndUpdate(id, updateLandDto, { new: true })
      .exec();
  }

  async deleteLand(id: string): Promise<{ message: string }> {
    const result = await this.landModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException(`Land with ID ${id} not found`);
    }
    return { message: `Land with ID ${id} has been deleted` };
  }
}
