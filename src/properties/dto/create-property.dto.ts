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

  @IsOptional()
  @IsString()
  @IsEnum([
    'house',
    'apartment',
    'land',
    'loft',
    'retail',
    'building',
    'office',
    'other',
  ])
  @Type(() => String)
  propertyType?: string;

  @IsNumber()
  @IsNotEmpty()
  @Min(0)
  @Type(() => Number)
  landArea: number;

  @IsString()
  @IsEnum(['sale', 'rent'])
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
