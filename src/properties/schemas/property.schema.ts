import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { DealType } from '../enums/property.enum';
import { ConstructionType } from '../enums/construction.enum';
import { Construction } from './construction.schema';
import { Counter } from './counter.schema';

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

  @Prop({ required: true, default: null, unique: true })
  code: string;
}

export interface PropertyDocument extends Property {
  propertyType: string;
}

export const PropertySchema = SchemaFactory.createForClass(Property);

// Lógica para generar el código de propiedad
PropertySchema.pre<Property>('validate', async function (next) {
  if (!this.isNew) return next(); // Solo generar código para nuevos documentos

  try {
    // 1. Determinar primera letra (V/R)
    const dealCode = this.dealType === DealType.VENTA ? 'V' : 'R';

    // 2. Determinar segunda parte del código
    let typeCode: string;

    const doc = this as unknown as { propertyType: string };

    if (doc.propertyType === 'Land') {
      typeCode = 'T';
    } else {
      const constructionDoc = this as unknown as Construction; // Cast a Construction
      const typeMap: Record<ConstructionType, string> = {
        [ConstructionType.CASA]: 'C',
        [ConstructionType.DEPARTAMENTO]: 'D',
        [ConstructionType.LOFT]: 'L',
        [ConstructionType.LOCAL_COMERCIAL]: 'LC',
        [ConstructionType.EDIFICIO]: 'E',
        [ConstructionType.OFICINA]: 'O',
      };
      typeCode = typeMap[constructionDoc.constructionType];
    }

    // 3. Obtener secuencia incremental
    const prefix = `${dealCode}${typeCode}`;
    const counter = (await this.model('Counter').findOneAndUpdate(
      { prefix },
      { $inc: { seq: 1 } },
      { new: true, upsert: true },
    )) as Counter;

    // 4. Formatear código final
    this.code = `${prefix}${counter.seq.toString().padStart(3, '0')}`;

    console.log(this.code);

    next();
  } catch (error) {
    next(error);
  }
});
