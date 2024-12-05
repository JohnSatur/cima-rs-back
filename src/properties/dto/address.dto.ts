import { Type } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class AddressDto {
  @IsString()
  @IsOptional()
  @Type(() => String)
  street?: string;

  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  intNumber?: number;

  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  extNumber?: number;

  @IsOptional()
  @Type(() => String)
  neighborhood?: string;

  @IsNotEmpty()
  @Type(() => Number)
  zipcode: number;

  @IsOptional()
  @Type(() => String)
  city?: string;

  @IsOptional()
  @Type(() => String)
  state?: string;

  @IsNotEmpty()
  @Type(() => String)
  country: string;
}
