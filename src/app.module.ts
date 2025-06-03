import { Module } from '@nestjs/common';
import { PropertiesModule } from './properties/properties.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { CommonModule } from './common/common.module';
import { ImagesModule } from './images/images.module';
import { MailModule } from './mail/mail.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRoot(process.env.MONGODB),
    PropertiesModule,
    CommonModule,
    ImagesModule,
    MailModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
