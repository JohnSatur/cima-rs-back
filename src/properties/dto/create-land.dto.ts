import { IsEnum, IsNumber, IsString, Max, Min } from 'class-validator';
import { CreatePropertyDto } from './create-property.dto';
import { Type } from 'class-transformer';
import { LandType, LandUse, Topography } from '../enums/land.enum';

export class CreateLandDto extends CreatePropertyDto {
  @IsString()
  @IsEnum(LandUse)
  @Type(() => String)
  landUse: string;

  @IsNumber()
  @Min(0)
  @Max(1)
  landOccupationCoefficient: number;

  @IsString()
  @IsEnum(LandType)
  @Type(() => String)
  landType: string;

  @IsString()
  @IsEnum(Topography)
  @Type(() => String)
  topography: string;
}
