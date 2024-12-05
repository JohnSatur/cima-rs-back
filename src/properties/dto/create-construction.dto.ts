import {
  IsArray,
  IsBoolean,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  Min,
} from 'class-validator';

export class CreateConstructionDto {
  @IsNumber()
  @IsOptional()
  @Min(0)
  rooms?: number;

  @IsNumber()
  @IsOptional()
  @Min(0)
  bathrooms?: number;

  @IsNumber()
  @IsOptional()
  @Min(0)
  builtArea?: number;

  @IsNumber()
  @IsOptional()
  @IsPositive()
  floors?: number;

  @IsArray()
  @IsOptional()
  equipment?: string[];

  @IsString()
  @IsOptional()
  finishes?: string;

  @IsBoolean()
  @IsOptional()
  furnished?: boolean;

  @IsString()
  @IsOptional()
  constructionStyle?: string;

  @IsBoolean()
  @IsOptional()
  private?: boolean;

  @IsNumber()
  @IsOptional()
  yearOfConstruction?: number;
}