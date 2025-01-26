import { Module } from '@nestjs/common';
import { PropertiesService } from './properties.service';
import { PropertiesController } from './properties.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Property, PropertySchema } from './schemas/property.schema';
import { Land, LandSchema } from './schemas/land.schema';
import {
  Construction,
  ConstructionSchema,
} from './schemas/construction.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Property.name,
        schema: PropertySchema,
        discriminators: [
          { name: Land.name, schema: LandSchema },
          { name: Construction.name, schema: ConstructionSchema },
        ],
      },
    ]),
  ],
  controllers: [PropertiesController],
  providers: [PropertiesService],
})
export class PropertiesModule {}
