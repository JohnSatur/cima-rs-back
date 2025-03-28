import { MongoClient } from 'mongodb';
import * as XLSX from 'xlsx';
import { DealType } from '../properties/enum/property.enum';
import { ConstructionType } from '../properties/enum/construction.enum';
import { LandType, LandUse, Topography } from '../properties/enum/land.enum';

interface PropertyData {
  propertyType: 'Construction' | 'Land';
  dealType: DealType;
  price: number;
  landArea?: number;
  description?: string;
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
  services?: string[];
  location?: {
    longitude: number;
    latitude: number;
  };
  notes?: string;
  commissionPercentage?: number;
  ownerName?: string;
  featured: boolean;
  coverImage: string;
  images: string[];
  // Campos específicos de Construction
  rooms?: number;
  bathrooms?: number;
  builtArea?: number;
  floors?: number;
  equipment?: string[];
  finishes?: string;
  furnished?: boolean;
  constructionStyle?: string;
  private?: boolean;
  constructionYear?: number;
  constructionType?: ConstructionType;
  // Campos específicos de Land
  landUse?: LandUse;
  landOccupationCoefficient?: number;
  landType?: LandType;
  topography?: Topography;
  code?: string;
}

interface ExcelRow {
  propertyType: string;
  dealType: string;
  price: string | number;
  landArea?: string | number;
  description?: string;
  street: string;
  intNumber: string;
  extNumber: string;
  neighborhood: string;
  zipCode: string | number;
  city: string;
  state: string;
  country: string;
  services?: string;
  longitude?: string | number;
  latitude?: string | number;
  notes?: string;
  commissionPercentage?: string | number;
  ownerName?: string;
  featured?: string | boolean;
  coverImage?: string;
  images?: string;
  // Campos de Construction
  rooms?: string | number;
  bathrooms?: string | number;
  builtArea?: string | number;
  floors?: string | number;
  equipment?: string;
  finishes?: string;
  furnished?: string | boolean;
  constructionStyle?: string;
  private?: string | boolean;
  constructionYear?: string | number;
  constructionType?: string;
  // Campos de Land
  landUse?: string;
  landOccupationCoefficient?: string | number;
  landType?: string;
  topography?: string;
}

function toNumber(value: string | number | undefined): number | undefined {
  if (value === undefined || value === null || value === '') return undefined;
  const num = Number(value);
  return isNaN(num) ? undefined : num;
}

async function generatePropertyCode(
  db: any,
  property: PropertyData,
): Promise<string> {
  // 1. Determinar primera letra (V/R)
  const dealCode = property.dealType === DealType.VENTA ? 'V' : 'R';

  // 2. Determinar segunda parte del código
  let typeCode: string;
  if (property.propertyType === 'Land') {
    typeCode = 'T';
  } else {
    const typeMap: Record<ConstructionType, string> = {
      [ConstructionType.CASA]: 'C',
      [ConstructionType.DEPARTAMENTO]: 'D',
      [ConstructionType.LOFT]: 'L',
      [ConstructionType.LOCAL_COMERCIAL]: 'LC',
      [ConstructionType.EDIFICIO]: 'E',
      [ConstructionType.OFICINA]: 'O',
    };
    typeCode = typeMap[property.constructionType as ConstructionType];
  }

  // 3. Obtener secuencia incremental
  const prefix = `${dealCode}${typeCode}`;
  const counter = await db
    .collection('counters')
    .findOneAndUpdate(
      { prefix },
      { $inc: { seq: 1 } },
      { returnDocument: 'after', upsert: true },
    );

  // 4. Formatear código final
  return `${prefix}${counter.seq.toString().padStart(3, '0')}`;
}

async function importProperties(excelPath: string, mongoUri: string) {
  const client = new MongoClient(mongoUri);

  try {
    await client.connect();
    console.log('Conectado a MongoDB');

    // Leer el archivo Excel
    const workbook = XLSX.readFile(excelPath);
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const data = XLSX.utils.sheet_to_json(worksheet) as ExcelRow[];

    const db = client.db('cima-rs-db');

    // Transformar los datos
    const properties: PropertyData[] = [];

    for (const row of data) {
      const property: any = {
        propertyType: row.propertyType,
        dealType: row.dealType,
        price: toNumber(row.price),
        landArea: toNumber(row.landArea),
        description: row.description,
        address: Object.fromEntries(
          Object.entries({
            street: row.street,
            intNumber: row.intNumber,
            extNumber: row.extNumber,
            neighborhood: row.neighborhood,
            zipCode: toNumber(row.zipCode),
            city: row.city,
            state: row.state,
            country: row.country,
          }).filter(
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            ([_, value]) =>
              value !== undefined && value !== null && value !== '',
          ),
        ),
        services: row.services
          ? row.services.split(',').map((s: string) => s.trim())
          : undefined,
        location:
          row.longitude && row.latitude
            ? {
                longitude: toNumber(row.longitude),
                latitude: toNumber(row.latitude),
              }
            : undefined,
        notes: row.notes,
        commissionPercentage: toNumber(row.commissionPercentage),
        ownerName: row.ownerName,
        featured: Boolean(row.featured),
        coverImage:
          row.coverImage ||
          'https://cimabienesraicesyconstruccion.com/wp-content/uploads/2022/09/CIMA.png',
        images: row.images
          ? row.images.split(',').map((s: string) => s.trim())
          : [],
      };

      // Agregar campos específicos según el tipo de propiedad
      if (property.propertyType === 'Construction') {
        const constructionFields: any = {
          rooms: toNumber(row.rooms),
          bathrooms: toNumber(row.bathrooms),
          builtArea: toNumber(row.builtArea),
          floors: toNumber(row.floors),
          finishes: row.finishes,
          furnished: Boolean(row.furnished),
          constructionStyle: row.constructionStyle,
          private: Boolean(row.private),
          constructionYear: toNumber(row.constructionYear),
          constructionType: row.constructionType,
        };

        // Solo agregar equipment si tiene valor
        if (row.equipment) {
          constructionFields.equipment = row.equipment
            .split(',')
            .map((s: string) => s.trim());
        }

        Object.assign(property, constructionFields);
      } else if (property.propertyType === 'Land') {
        Object.assign(property, {
          landUse: row.landUse,
          landOccupationCoefficient: toNumber(row.landOccupationCoefficient),
          landType: row.landType,
          topography: row.topography,
        });
      }

      // Generar código único para la propiedad
      property.code = await generatePropertyCode(db, property);
      properties.push(property);
    }

    // Insertar en la base de datos
    const result = await db.collection('properties').insertMany(properties);
    console.log(`${result.insertedCount} propiedades importadas exitosamente`);
  } catch (error) {
    console.error('Error durante la importación:', error);
  } finally {
    await client.close();
    console.log('Conexión cerrada');
  }
}

// Ejemplo de uso
const excelPath =
  'C:\\Users\\fasto\\OneDrive\\Documentos\\Hisoka\\Clientes\\CIMA\\lista-propiedades.xlsx';
const mongoUri = 'mongodb://localhost:27017';

if (!excelPath) {
  console.error(
    'Por favor, proporciona la ruta del archivo Excel como argumento',
  );
  process.exit(1);
}

importProperties(excelPath, mongoUri);
