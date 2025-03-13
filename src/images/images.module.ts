import { Module } from '@nestjs/common';
import { ImagesService } from './images.service';
import { ImagesController } from './images.controller';
import { ConfigModule } from '@nestjs/config';
import { CloudinaryProvider } from './providers/cloudinary.provider';

@Module({
  imports: [ConfigModule],
  controllers: [ImagesController],
  providers: [ImagesService, CloudinaryProvider],
})
export class ImagesModule {}
