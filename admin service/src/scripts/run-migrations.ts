import { Pool } from 'pg';
import * as dotenv from 'dotenv';
import * as fs from 'fs';
import * as path from 'path';

// Cargar variables de entorno
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

// Verificar que la URL de la base de datos esté configurada
if (!process.env.DB_URL) {
  console.error('Error: La variable de entorno DB_URL no está configurada en el archivo .env');
  process.exit(1);
}

// Función para analizar la URL de conexión
function parseDatabaseUrl(url: string) {
  const parsed = new URL(url);
  return {
    user: parsed.username,
    password: parsed.password,
    host: parsed.hostname,
    port: parseInt(parsed.port, 10),
    database: parsed.pathname.slice(1), // Elimina la barra inicial
    ssl: {
      rejectUnauthorized: false
    }
  };
}

// Configurar la conexión a la base de datos
const dbConfig = parseDatabaseUrl(process.env.DB_URL);
const pool = new Pool(dbConfig);

// Función para dividir el SQL en sentencias individuales
function splitSQLStatements(sqlContent: string): string[] {
  // Eliminar comentarios y dividir por punto y coma
  return sqlContent
    .replace(/--.*\n/g, '') // Eliminar comentarios de una línea
    .replace(/\/\*[\s\S]*?\*\//g, '') // Eliminar comentarios multilínea
    .split(';')
    .map(statement => statement.trim())
    .filter(statement => statement.length > 0);
}

async function runMigrations() {
  const client = await pool.connect();
  
  try {
    console.log('Iniciando migraciones...');
    
    // Leer todos los archivos de migración ordenados
    const migrationsDir = path.join(process.cwd(), 'src/migrations');
    const migrationFiles = fs.readdirSync(migrationsDir)
      .filter(file => file.endsWith('.sql'))
      .sort();
    
    console.log(`Encontradas ${migrationFiles.length} migraciones para ejecutar`);
    
    // Iniciar una transacción
    await client.query('BEGIN');
    
    try {
      // Ejecutar cada migración en orden
      for (const file of migrationFiles) {
        console.log(`\nEjecutando migración: ${file}`);
        const migrationPath = path.join(migrationsDir, file);
        const migrationSQL = fs.readFileSync(migrationPath, 'utf8');
        
        // Dividir el SQL en sentencias individuales
        const statements = splitSQLStatements(migrationSQL);
        
        // Ejecutar cada sentencia por separado
        for (const statement of statements) {
          if (statement.trim()) {
            console.log(`  Ejecutando: ${statement.substring(0, 60)}...`);
            await client.query(statement);
          }
        }
        
        console.log(`Migración completada: ${file}`);
      }
      
      // Si todo va bien, hacer commit de la transacción
      await client.query('COMMIT');
      console.log('\n¡Todas las migraciones se han ejecutado exitosamente!');
      
    } catch (error) {
      // Si hay un error, hacer rollback de la transacción
      await client.query('ROLLBACK');
      console.error('Error durante la migración, se ha realizado un rollback:', error);
      throw error;
    }
    
  } catch (error) {
    console.error('Error al ejecutar las migraciones:', error);
    process.exit(1);
  } finally {
    // Liberar el cliente de vuelta al pool
    client.release();
    // Cerrar el pool de conexiones
    await pool.end();
    process.exit(0);
  }
}

// Ejecutar la función principal
runMigrations();
