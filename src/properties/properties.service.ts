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

@Injectable()
export class PropertiesService {
  constructor(
    @InjectModel(Land.name) private readonly landModel: Model<Land>,
    @InjectModel(Construction.name)
    private readonly constructionModel: Model<Construction>,
    @InjectModel(Property.name) private readonly propertyModel: Model<Property>,
  ) {}

  // TODO: Tipar estrictamente
  async getAllProperties(page: number = 1, limit: number = 8) {
    // Calcula el número de documentos a saltar
    const skip = (page - 1) * limit;

    const properties = await this.propertyModel
      .find()
      .skip(skip)
      .limit(limit)
      .lean()
      .exec();

    return properties.map((prop) => ({
      type: (prop as any).propertyType, // Usa el discriminador
      data: {
        ...prop,
        // Elimina campos internos de Mongoose
        __v: undefined,
        createdAt: undefined,
        updatedAt: undefined,
      },
    }));
  }

  // TODO: Tipar estrictamente
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

  async getFeaturedProperties() {
    const properties = await this.propertyModel
      .find({
        featured: true,
      })
      .limit(3)
      .lean()
      .exec();

    return properties.map((prop) => ({
      type: (prop as any).propertyType, // Usa el discriminador
      data: {
        ...prop,
        // Elimina campos internos de Mongoose
        __v: undefined,
        createdAt: undefined,
        updatedAt: undefined,
      },
    }));
  }

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

  async deleteLand(id: string): Promise<{ message: string }> {
    const result = await this.landModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException(`Land with ID ${id} not found`);
    }
    return { message: `Land with ID ${id} has been deleted` };
  }

  // async getFilteredProperties(query: QueryPropertiesDto) {
  //   const { page, limit, ...filters } = query;
  //   const skip = (page - 1) * limit;

  //   // Queries de ambas construcciones
  //   const constructionQuery = this.buildConstructionQuery(filters);
  //   const landQuery = this.buildLandQuery(filters);

  //   const [constructions, lands] = await Promise.all([
  //     this.constructionModel
  //       .find(constructionQuery)
  //       .skip(skip)
  //       .limit(limit)
  //       .exec(),
  //     this.landModel.find(landQuery).skip(skip).limit(limit).exec(),
  //   ]);

  //   const total = await Promise.all([
  //     this.constructionModel.countDocuments(constructionQuery),
  //     this.landModel.countDocuments(landQuery),
  //   ]).then(([countConstruction, countLand]) => countConstruction + countLand);

  //   return {
  //     data: [...constructions, ...lands],
  //     total,
  //     page,
  //     totalPages: Math.ceil(total / limit),
  //   };
  // }

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
