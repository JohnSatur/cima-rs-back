import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreatePropertyDto } from './dto/create-property.dto';
import { UpdatePropertyDto } from './dto/update-property.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Property } from './schemas/property.schema';
import { Model } from 'mongoose';

@Injectable()
export class PropertiesService {
  constructor(
    @InjectModel(Property.name) private propertyModel: Model<Property>,
  ) {}
  async create(createPropertyDto: CreatePropertyDto) {
    try {
      const newProperty = await this.propertyModel.create(createPropertyDto);
      return newProperty;
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(
        'Error creating property. Check logs',
      );
    }
  }

  findAll() {
    return `This action returns all properties`;
  }

  findOne(id: number) {
    return `This action returns a #${id} property`;
  }

  update(id: number, updatePropertyDto: UpdatePropertyDto) {
    return `This action updates a #${id} property`;
  }

  remove(id: number) {
    return `This action removes a #${id} property`;
  }
}
