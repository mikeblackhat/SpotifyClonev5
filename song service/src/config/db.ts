import { neon } from "@neondatabase/serverless";
import dotenv from "dotenv";
import path from 'path';
import { fileURLToPath } from 'url';

// Obtener el directorio actual en módulos ES
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Cargar variables de entorno desde .env en el directorio raíz del proyecto
const envPath = path.resolve(process.cwd(), '../../.env');
console.log('Cargando variables de entorno desde:', envPath);

dotenv.config({ path: envPath });

// También cargar desde el archivo .env en la raíz del song service
const localEnvPath = path.resolve(process.cwd(), '.env');
console.log('Cargando variables de entorno locales desde:', localEnvPath);
dotenv.config({ path: localEnvPath, override: true });

// Verificar que DB_URL esté definido
if (!process.env.DB_URL) {
  console.error('Error: DB_URL no está definido en las variables de entorno');
  console.log('Variables de entorno cargadas:', Object.keys(process.env).join(', '));
  throw new Error('DB_URL no está definido en las variables de entorno');
}

export const sql = neon(process.env.DB_URL);
