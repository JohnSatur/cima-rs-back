import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Property } from './property.schema';
import { LandType, LandUse, Topography } from '../enum/land.enum';

@Schema()
export class Land extends Property {
  @Prop({
    type: String,
    enum: LandUse,
  })
  landUse: string;

  @Prop({ type: Number, min: 0, max: 1 })
  landOccupationCoefficient: number;

  @Prop({ type: String, enum: LandType })
  landType: string;

  @Prop({ type: String, enum: Topography })
  topography: string;
}

export const LandSchema = SchemaFactory.createForClass(Land);
