import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ discriminatorKey: 'type' })
export class Property extends Document {
  @Prop({ type: Object, required: true })
  address: {
    street: string;
    intNumber: number;
    extNumber: number;
    neighborhood: string;
    zipCode: number;
    city: string;
    state: string;
    country: string;
  };

  @Prop()
  description: string;

  @Prop({ required: true, min: 0 })
  price: number;
}

export const PropertySchema = SchemaFactory.createForClass(Property);
