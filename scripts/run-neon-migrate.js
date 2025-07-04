// @ts-check
import { neon } from '@neondatabase/serverless';
import { promises as fs } from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

// Configurar dotenv
dotenv.config({ path: '.env' });

// Verificar que DATABASE_URL esté definido
const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
  throw new Error('DATABASE_URL no está definido en el archivo .env');
}

// Obtener __dirname en ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configurar el cliente de Neon
const sql = neon(databaseUrl);

// Función para ejecutar una consulta SQL con manejo de errores
async function executeQuery(query) {
  try {
    await sql(query);
    return true;
  } catch (error) {
    // Ignorar errores de "ya existe" o "no existe"
    if (error.message.includes('already exists') || 
        error.message.includes('does not exist') ||
        error.message.includes('cannot be implemented')) {
      console.log(`   ℹ️ ${error.message.split('\n')[0]}`);
      return false;
    }
    console.error(`   ❌ Error en la consulta: ${error.message.split('\n')[0]}`);
    throw error;
  }
}

async function runMigration() {
  console.log('🔍 Iniciando migración...');
  
  try {
    // Leer el archivo de migración
    const migrationPath = path.join(__dirname, '../migrations/001_spotify_clone_schema.sql');
    console.log(`📖 Leyendo archivo de migración: ${migrationPath}`);
    
    const migrationSql = await fs.readFile(migrationPath, 'utf8');
    console.log('🚀 Ejecutando migración...');
    
    // Dividir el SQL en declaraciones individuales
    const statements = migrationSql
      .split(';')
      .map(s => s.trim())
      .filter(s => s.length > 0);
    
    // Primera pasada: crear solo las tablas sin restricciones
    console.log('🔨 Creando tablas...');
    for (const statement of statements) {
      if (statement.trim().toUpperCase().startsWith('CREATE TABLE')) {
        console.log(`   ▶ ${statement.substring(0, 60).replace(/\s+/g, ' ').trim()}...`);
        await executeQuery(statement);
      }
    }
    
    // Segunda pasada: agregar restricciones
    console.log('🔗 Agregando restricciones...');
    for (const statement of statements) {
      if (statement.trim().toUpperCase().startsWith('ALTER TABLE')) {
        console.log(`   ▶ ${statement.substring(0, 60).replace(/\s+/g, ' ').trim()}...`);
        await executeQuery(statement);
      }
    }
    
    // Tercera pasada: crear índices
    console.log('📊 Creando índices...');
    for (const statement of statements) {
      if (statement.trim().toUpperCase().startsWith('CREATE INDEX')) {
        console.log(`   ▶ ${statement.substring(0, 60).replace(/\s+/g, ' ').trim()}...`);
        await executeQuery(statement);
      }
    }
    
    // Cuarta pasada: funciones y triggers
    console.log('⚙️ Configurando funciones y triggers...');
    for (const statement of statements) {
      if (statement.trim().toUpperCase().startsWith('CREATE OR REPLACE FUNCTION') ||
          statement.trim().toUpperCase().startsWith('CREATE TRIGGER') ||
          statement.trim().toUpperCase().startsWith('COMMENT ON') ||
          statement.trim().toUpperCase().startsWith('DO $$')) {
        console.log(`   ▶ ${statement.substring(0, 60).replace(/\s+/g, ' ').trim()}...`);
        await executeQuery(statement);
      }
    }
    
    console.log('✅ Migración completada con éxito');
  } catch (error) {
    console.error('❌ Error durante la migración:', error.message);
    process.exit(1);
  } finally {
    // No necesitamos cerrar la conexión con el cliente de Neon
    console.log('🔌 Conexión cerrada');
    process.exit(0);
  }
}

// Ejecutar la migración
runMigration();
