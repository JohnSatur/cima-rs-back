import { MongoClient } from 'mongodb';
import { v2 as cloudinary } from 'cloudinary';
import * as dotenv from 'dotenv';

// Cargar variables de entorno
dotenv.config();

// Configurar Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

async function updatePropertyImages(mongoUri: string) {
  const client = new MongoClient(mongoUri);

  try {
    await client.connect();
    console.log('Conectado a MongoDB');

    const db = client.db('cima-rs-db');

    // Obtener todas las imágenes de Cloudinary
    const result = await cloudinary.api.resources({
      type: 'upload',
      max_results: 500, // Aumentar si hay más imágenes
    });

    // Agrupar imágenes por código de propiedad
    const imagesByProperty = result.resources.reduce(
      (acc: Record<string, string[]>, resource) => {
        // Extraer el código de propiedad de la URL (ejemplo: VC011)
        const match = resource.url.match(/\/cima-rs\/([^/]+)\//);
        if (match) {
          const propertyCode = match[1];
          if (!acc[propertyCode]) {
            acc[propertyCode] = [];
          }
          acc[propertyCode].push(resource.url);
        }
        return acc;
      },
      {},
    );

    // Actualizar cada propiedad con sus imágenes
    for (const [propertyCode, images] of Object.entries(imagesByProperty) as [
      string,
      string[],
    ][]) {
      const result = await db
        .collection('properties')
        .updateOne({ code: propertyCode }, { $set: { images } });

      if (result.matchedCount === 0) {
        console.log(`No se encontró la propiedad con código ${propertyCode}`);
      } else {
        console.log(
          `Actualizada la propiedad ${propertyCode} con ${images.length} imágenes`,
        );
      }
    }

    console.log('Proceso completado');
  } catch (error) {
    console.error('Error durante la actualización:', error);
  } finally {
    await client.close();
    console.log('Conexión cerrada');
  }
}

// Ejecutar el script
const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017';
updatePropertyImages(mongoUri);
