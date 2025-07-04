import { Pool } from '@neondatabase/serverless';
import { promises as fs } from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';
import * as dotenv from 'dotenv';

// Cargar variables de entorno
dotenv.config({ path: '.env' });

// Obtener __dirname en ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function runMigration() {
  // Verificar que la variable de entorno DATABASE_URL esté configurada
  if (!process.env.DATABASE_URL) {
    console.error('Error: La variable de entorno DATABASE_URL no está configurada.');
    console.log('Por favor, asegúrate de tener un archivo .env con DATABASE_URL configurado.');
    process.exit(1);
  }

    // Configurar la conexión a la base de datos
    const connectionString = process.env.DatabaseUrlNeon || process.env.DATABASE_URL || '';
    
    if (!connectionString) {
      console.error('❌ Error: No se encontró la variable de entorno DATABASE_URL o DatabaseUrlNeon');
      process.exit(1);
    }

    const pool = new Pool({
      connectionString: connectionString,
      ssl: {
        rejectUnauthorized: false
      }
    });

  const client = await pool.connect();

  try {
    console.log('🔍 Conectado a la base de datos Neon...');
    
    // Crear la tabla de migraciones si no existe
    await client.query(`
      CREATE TABLE IF NOT EXISTS migrations (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        executed_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Obtener migraciones ya ejecutadas
    const { rows: executedMigrations } = await client.query<{ name: string }>(
      'SELECT name FROM migrations ORDER BY name'
    );
    const executedMigrationNames = new Set(executedMigrations.map(m => m.name));

    // Leer archivos de migración
    const migrationsDir = path.join(process.cwd(), 'migrations');
    const files = await fs.readdir(migrationsDir);
    const migrationFiles = files
      .filter(file => file.endsWith('.sql'))
      .sort();

    console.log(`📋 Encontradas ${migrationFiles.length} migraciones en ${migrationsDir}`);

    // Ejecutar migraciones pendientes
    for (const fileName of migrationFiles) {
      if (!executedMigrationNames.has(fileName)) {
        console.log(`🚀 Ejecutando migración: ${fileName}...`);
        
        const filePath = path.join(migrationsDir, fileName);
        const sql = await fs.readFile(filePath, 'utf8');
        
        // Ejecutar cada sentencia SQL por separado
        const statements = sql.split(';').filter(statement => statement.trim().length > 0);
        
        await client.query('BEGIN');
        try {
          for (const statement of statements) {
            if (statement.trim()) {
              await client.query(statement);
            }
          }
          
          // Registrar la migración como ejecutada
          await client.query(
            'INSERT INTO migrations (name) VALUES ($1)',
            [fileName]
          );
          
          await client.query('COMMIT');
          console.log(`✅ Migración completada: ${fileName}`);
        } catch (error) {
          await client.query('ROLLBACK');
          console.error(`❌ Error al ejecutar la migración ${fileName}:`, error);
          throw error;
        }
      } else {
        console.log(`⏩ Saltando migración ya ejecutada: ${fileName}`);
      }
    }

    console.log('✨ ¡Todas las migraciones se han ejecutado con éxito!');
  } catch (error) {
    console.error('❌ Error durante la ejecución de las migraciones:', error);
    process.exit(1);
  } finally {
    client.release();
    await pool.end();
  }
}

// Ejecutar el script
runMigration()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('❌ Error en la migración:', error);
    process.exit(1);
  });
