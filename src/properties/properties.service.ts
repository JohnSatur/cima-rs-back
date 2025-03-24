import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CreateConstructionDto } from './dto/create-construction.dto';
import { Construction } from './schemas/construction.schema';
import { Land } from './schemas/land.schema';
import { CreateLandDto } from './dto/create-land.dto';
import { UpdateConstructionDto } from './dto/update-construction.dto';
import { Property } from './schemas/property.schema';
import { UpdateLandDto } from './dto/update-land.dto';
import { FilterPropertiesDto } from './dto/filter-properties.dto';

@Injectable()
export class PropertiesService {
  constructor(
    @InjectModel(Land.name) private readonly landModel: Model<Land>,
    @InjectModel(Construction.name)
    private readonly constructionModel: Model<Construction>,
    @InjectModel(Property.name) private readonly propertyModel: Model<Property>,
  ) {}

  async getAllProperties(page: number = 1, limit: number = 8, type?: string) {
    // Calcula el número de documentos a saltar
    const skip = (page - 1) * limit;

    if (page < 1) throw new BadRequestException('La página debe ser mayor a 0');

    if (limit < 1)
      throw new BadRequestException('El límite debe ser mayor a 0');

    const query: any = {};

    if (type) query.propertyType = type;

    const properties = await this.propertyModel
      .find(query)
      .skip(skip)
      .limit(limit)
      .lean()
      .exec();

    const total = await this.propertyModel.countDocuments(query);

    const transformedProperties = properties.map((prop) => {
      const sanitizedProperty = { ...prop };

      delete sanitizedProperty.address.street;
      delete sanitizedProperty.address.intNumber;
      delete sanitizedProperty.address.extNumber;
      delete sanitizedProperty.commissionPercentage;
      delete sanitizedProperty.ownerName;
      delete sanitizedProperty.notes;

      return {
        type: (sanitizedProperty as any).propertyType,
        data: {
          ...sanitizedProperty,
          // Elimina campos internos de Mongoose
          __v: undefined,
          createdAt: undefined,
          updatedAt: undefined,
        },
      };
    });

    return {
      properties: transformedProperties,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getPropertyById(id: string) {
    if (!Types.ObjectId.isValid(id))
      throw new BadRequestException('El ID proporcionado no es válido');

    const property = await this.propertyModel.findById(id).lean().exec();

    if (!property)
      throw new NotFoundException(`Property with ID ${id} not found`);

    const sanitizedProperty = { ...property };

    delete sanitizedProperty.address.street;
    delete sanitizedProperty.address.intNumber;
    delete sanitizedProperty.address.extNumber;
    delete sanitizedProperty.commissionPercentage;
    delete sanitizedProperty.ownerName;
    delete sanitizedProperty.notes;

    return {
      type: (sanitizedProperty as any).propertyType, // Usa el discriminador
      data: {
        ...sanitizedProperty,
        // Elimina campos internos de Mongoose
        __v: undefined,
        createdAt: undefined,
        updatedAt: undefined,
      },
    };
  }

  async deleteProperty(id: string): Promise<{ message: string }> {
    if (!Types.ObjectId.isValid(id))
      throw new BadRequestException('El ID proporcionado no es válido');

    const result = await this.propertyModel.deleteOne({ _id: id });

    if (!result)
      throw new NotFoundException(`Propiedad con ID ${id} no encontrada`);

    return { message: 'Propiedad eliminada con éxito' };
  }

  async createConstruction(createConstructionDto: CreateConstructionDto) {
    const construction = new this.constructionModel(createConstructionDto);
    return construction.save();
  }

  async updateConstruction(
    id: string,
    updateConstructionDto: UpdateConstructionDto,
  ): Promise<Construction> {
    if (!Types.ObjectId.isValid(id))
      throw new BadRequestException('El ID proporcionado no es válido');

    const updatedConstruction = await this.constructionModel.findByIdAndUpdate(
      id,
      updateConstructionDto,
      { new: true },
    );

    if (!updatedConstruction)
      throw new NotFoundException(`Construction with ID ${id} not found`);

    return updatedConstruction;
  }

  async createLand(createLandDto: CreateLandDto) {
    const land = new this.landModel(createLandDto);
    return land.save();
  }

  async updateLand(id: string, updateLandDto: UpdateLandDto): Promise<Land> {
    if (!Types.ObjectId.isValid(id))
      throw new BadRequestException('El ID proporcionado no es válido');

    const updatedLand = await this.landModel.findByIdAndUpdate(
      id,
      updateLandDto,
      { new: true },
    );

    if (!updatedLand)
      throw new NotFoundException(`Construction with ID ${id} not found`);

    return updatedLand;
  }

  async filterProperties(filters: FilterPropertiesDto) {
    const {
      page = 1,
      limit = 8,
      dealType,
      city,
      minPrice,
      maxPrice,
      minArea,
      maxArea,
      featured,
    } = filters;

    const skip = (page - 1) * limit;
    const query: any = {};

    // Filtros básicos
    if (dealType) query.dealType = dealType;
    if (city) query['address.city'] = city;

    // Filtros de precio
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = minPrice;
      if (maxPrice) query.price.$lte = maxPrice;
    }

    if (featured) query.featured = featured;

    // Filtros de área
    if (minArea || maxArea) {
      query.$or = [{ 'constructionDetails.totalArea': {} }, { landArea: {} }];

      if (minArea) {
        query.$or[0]['constructionDetails.totalArea'].$gte = minArea;
        query.$or[1].landArea.$gte = minArea;
      }

      if (maxArea) {
        query.$or[0]['constructionDetails.totalArea'].$lte = maxArea;
        query.$or[1].landArea.$lte = maxArea;
      }
    }

    const properties = await this.propertyModel
      .find(query)
      .skip(skip)
      .limit(limit)
      .lean()
      .exec();

    const total = await this.propertyModel.countDocuments(query);

    const transformedProperties = properties.map((prop) => {
      const sanitizedProperty = { ...prop };

      delete sanitizedProperty.address.street;
      delete sanitizedProperty.address.intNumber;
      delete sanitizedProperty.address.extNumber;
      delete sanitizedProperty.commissionPercentage;
      delete sanitizedProperty.ownerName;
      delete sanitizedProperty.notes;

      return {
        type: (sanitizedProperty as any).propertyType,
        data: {
          ...sanitizedProperty,
          __v: undefined,
          createdAt: undefined,
          updatedAt: undefined,
        },
      };
    });

    return {
      properties: transformedProperties,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  private buildConstructionQuery(filters: any) {
    const query: any = {};
    if (filters.city) query['address.city'] = filters.city;
    if (filters.dealType) query.dealType = filters.dealType;
    if (filters.minPrice || filters.maxPrice) {
      query.price = {};
      if (filters.minPrice) query.price.$gte = filters.minPrice;
      if (filters.maxPrice) query.price.$lte = filters.maxPrice;
    }
    return query;
  }

  private buildLandQuery(filters: any) {
    const query: any = {};
    if (filters.city) query['address.city'] = filters.city;
    if (filters.dealType) query.dealType = filters.dealType;
    if (filters.minArea || filters.maxArea) {
      query.landArea = {};
      if (filters.minArea) query.landArea.$gte = filters.minArea;
      if (filters.maxArea) query.landArea.$lte = filters.maxArea;
    }
    return query;
  }
}
