import { Module } from '@nestjs/common';
import { PropertiesService } from './properties.service';
import { PropertiesController } from './properties.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Property, PropertySchema } from './schemas/property.schema';
import { ConstructionSchema } from './schemas/construction.schema';
import { LandSchema } from './schemas/land.schema';

@Module({
  imports: [
    MongooseModule.forFeatureAsync([
      {
        name: Property.name,
        useFactory: () => {
          const schema = PropertySchema;
          schema.discriminator('construction', ConstructionSchema);
          schema.discriminator('land', LandSchema);
          return schema;
        },
      },
    ]),
  ],
  controllers: [PropertiesController],
  providers: [PropertiesService],
})
export class PropertiesModule {}
