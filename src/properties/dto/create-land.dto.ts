import { IsEnum, IsNumber, IsString, Max, Min } from 'class-validator';
import { CreatePropertyDto } from './create-property.dto';
import { Type } from 'class-transformer';

export class CreateLandDto extends CreatePropertyDto {
  @IsString()
  @IsEnum(['Residential', 'Commercial', 'Agricultural', 'Mixed'])
  @Type(() => String)
  landUse: string;

  @IsNumber()
  @Min(0)
  @Max(1)
  landOccupationCoefficient: number;

  @IsString()
  @IsEnum(['Urban', 'Suburban', 'Rural', 'Industrial'])
  @Type(() => String)
  landType: string;

  @IsString()
  @IsEnum(['Flat', 'Inclined', 'Irregular'])
  @Type(() => String)
  topography: string;
}
