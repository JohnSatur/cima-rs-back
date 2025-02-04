import {
  IsArray,
  IsDefined,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  Max,
  Min,
  ValidateNested,
} from 'class-validator';

import { AddressDto } from './address.dto';
import { Type } from 'class-transformer';
import { LocationDto } from './location.dto';
import { DealType } from '../enums/property.enum';

export class CreatePropertyDto {
  @IsDefined()
  @IsObject()
  @Type(() => AddressDto)
  address: AddressDto;

  @IsString()
  @IsDefined()
  @Type(() => String)
  description?: string;

  @IsNumber()
  @IsNotEmpty()
  @Type(() => Number)
  price: number;

  @IsNumber()
  @IsNotEmpty()
  @Min(0)
  @Type(() => Number)
  landArea: number;

  @IsString()
  @IsEnum(DealType)
  @Type(() => String)
  dealType: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  @Type(() => String)
  services?: string[];

  @ValidateNested()
  @IsOptional()
  @Type(() => LocationDto)
  location?: LocationDto;

  @IsString()
  @IsOptional()
  @Type(() => String)
  notes?: string;

  @IsNumber()
  @Min(0)
  @Max(100)
  @IsOptional()
  @Type(() => Number)
  commissionPercentage?: number;
}
