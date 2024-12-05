import { Module } from '@nestjs/common';
import { PropertiesModule } from './properties/properties.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot(process.env.MONGODB),
    PropertiesModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
