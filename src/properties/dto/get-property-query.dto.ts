import { IsOptional, IsEnum, IsNumber, IsString, Min } from 'class-validator';

export class GetPropertiesQueryDto {
  @IsOptional()
  @IsEnum(
    [
      'house',
      'apartment',
      'land',
      'loft',
      'retail',
      'building',
      'office',
      'other',
    ],
    {
      message: 'El tipo de propiedad no es válido.',
    },
  )
  propertyType?: string;

  @IsOptional()
  @IsEnum(['sale', 'rent'], {
    message: 'El tipo de trato debe ser "sale" o "rent".',
  })
  dealType?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  minPrice?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  maxPrice?: number;

  @IsOptional()
  @IsString()
  city?: string;

  @IsOptional()
  @IsString()
  state?: string;

  @IsOptional()
  @IsString()
  country?: string;
}
