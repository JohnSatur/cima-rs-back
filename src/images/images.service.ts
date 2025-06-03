import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { v2 as cloudinaryLib } from 'cloudinary';

@Injectable()
export class ImagesService {
  constructor(
    @Inject('CLOUDINARY') private readonly cloudinary: typeof cloudinaryLib,
  ) {}

  async listImages(): Promise<string[]> {
    try {
      const result = await this.cloudinary.api.resources({
        type: 'upload',
        max_results: 50,
      });
      return result.resources.map((resource) => resource.url);
    } catch (error) {
      throw new HttpException(
        `Error al obtener las imágenes: ${error}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getImageById(id: string): Promise<string> {
    try {
      const result = await this.cloudinary.api.resource(id);
      return result.secure_url;
    } catch (error) {
      throw new HttpException(
        `Imagen no encontrada: ${error.message}`,
        HttpStatus.NOT_FOUND,
      );
    }
  }

  async getPropertyImages(propertyCode: string): Promise<string[]> {
    try {
      const result = await this.cloudinary.api.resources({
        type: 'upload',
        prefix: `${propertyCode}`,
        max_results: 50,
        resource_type: 'image',
      });

      return result.resources.map((resource) => resource.secure_url);
    } catch (error) {
      throw new HttpException(
        `Imagenes de propiedad no encontradas: ${error.message}`,
        HttpStatus.NOT_FOUND,
      );
    }
  }

  async deleteImage(id: string): Promise<void> {
    try {
      await this.cloudinary.uploader.destroy(id);
    } catch (error) {
      throw new HttpException(
        `Error al eliminar la imagen: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
