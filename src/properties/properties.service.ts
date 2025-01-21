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

  async findAll(filters: any): Promise<Property[]> {
    const query: any = {};

    if (filters.propertyType) query.propertyType = filters.propertyType;
    if (filters.dealType) query.dealType = filters.dealType;
    if (filters.minPrice) query.price = { $gte: filters.minPrice };
    if (filters.maxPrice)
      query.price = { ...query.price, $lte: filters.maxPrice };
    if (filters.city) query['address.city'] = filters.city;
    if (filters.state) query['address.state'] = filters.state;
    if (filters.country) query['address.country'] = filters.country;

    return this.propertyModel.find(query).exec();
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
