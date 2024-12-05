import {
  IsDefined,
  IsNotEmpty,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
} from 'class-validator';

import { AddressDto } from './create-address.dto';
import { Type } from 'class-transformer';

export class CreatePropertyDto {
  @IsDefined()
  @IsObject()
  @Type(() => AddressDto)
  address: AddressDto;

  @IsString()
  @IsOptional()
  @Type(() => String)
  description?: string;

  @IsNumber()
  @IsNotEmpty()
  @Type(() => Number)
  price: number;
}
