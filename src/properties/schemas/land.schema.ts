import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Property } from './property.schema';

@Schema()
export class Land extends Property {
  @Prop({
    type: String,
    enum: ['Residential', 'Commercial', 'Agricultural', 'Mixed'],
  })
  landUse: string;

  @Prop({ type: Number, min: 0, max: 1 })
  landOccupationCoefficient: number;

  @Prop({ type: String, enum: ['Urban', 'Suburban', 'Rural', 'Industrial'] })
  landType: string;

  @Prop({ type: String, enum: ['Flat', 'Inclined', 'Irregular'] })
  topography: string;
}

export const LandSchema = SchemaFactory.createForClass(Land);
