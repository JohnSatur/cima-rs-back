import {
  Controller,
  Get,
  Param,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { ImagesService } from './images.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import { v2 as cloudinary } from 'cloudinary';

const storage = new CloudinaryStorage({ cloudinary });

@Controller('images')
export class ImagesController {
  constructor(private readonly imagesService: ImagesService) {}

  @Post()
  @UseInterceptors(FileInterceptor('file', { storage }))
  async uploadImage(@UploadedFile() file: Express.Multer.File) {
    return { imageUrl: file.path };
  }

  @Get()
  async listImages() {
    const images = await this.imagesService.listImages();
    return { images };
  }

  @Get('properties/:propertyCode')
  async getPropertyImages(@Param('propertyCode') propertyCode: string) {
    const images = await this.imagesService.getPropertyImages(propertyCode);
    return { images };
  }

  @Get(':id')
  async getImageById(@Param('id') id: string) {
    const imageUrl = await this.imagesService.getImageById(id);
    return { imageUrl };
  }
}
