import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Property } from './property.schema';
import { ConstructionType } from '../enum/construction.enum';

@Schema()
export class Construction extends Property {
  @Prop({ type: Number, min: 0 })
  rooms: number;

  @Prop({ type: Number, min: 0 })
  bathrooms: number;

  @Prop({ type: Number, min: 0 })
  builtArea: number;

  @Prop({ required: false, type: Number, min: 1 })
  floors: number;

  @Prop({ type: [String] })
  equipment: string[];

  @Prop({ type: String })
  finishes: string;

  @Prop({ type: Boolean })
  furnished: boolean;

  @Prop({ type: String })
  constructionStyle: string;

  @Prop({ type: Boolean })
  private: boolean;

  @Prop({
    required: false,
    type: Number,
    min: 0,
    validate: {
      validator: (value: number) => {
        const currentYear = new Date().getFullYear();
        return value <= currentYear;
      },
      message: `El año de construcción no puede ser posterior al año en curso (${new Date().getFullYear()}).`,
    },
  })
  constructionYear: number;

  @Prop({ type: String, enum: ConstructionType, required: true })
  constructionType: string;
}

export const ConstructionSchema = SchemaFactory.createForClass(Construction);
