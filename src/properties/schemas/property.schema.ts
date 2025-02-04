import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { DealType } from '../enums/property.enum';

@Schema({ discriminatorKey: 'propertyType', timestamps: true })
export class Property extends Document {
  @Prop({ type: Object, required: true })
  address: {
    street: string;
    intNumber: string;
    extNumber: string;
    neighborhood: string;
    zipCode: number;
    city: string;
    state: string;
    country: string;
  };

  @Prop({ required: false })
  description: string;

  @Prop({ required: true, min: 0 })
  price: number;

  @Prop({
    required: true,
    min: 0,
  })
  landArea: number;

  @Prop({
    required: true,
    enum: DealType,
  })
  dealType: string;

  @Prop({ required: false, type: [String] })
  services: string[];

  @Prop({
    required: false,
    type: { longitude: Number, latitude: Number },
  })
  location: { longitude: number; latitude: number };

  @Prop({
    required: false,
    type: String,
  })
  notes: string;

  @Prop({
    required: false,
    min: 0,
    max: 100,
  })
  commissionPercentage: number;
}

export const PropertySchema = SchemaFactory.createForClass(Property);
