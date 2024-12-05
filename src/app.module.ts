import { Module } from '@nestjs/common';
import { PropertiesModule } from './properties/properties.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { CommonModule } from './common/common.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot(process.env.MONGODB),
    PropertiesModule,
    CommonModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
