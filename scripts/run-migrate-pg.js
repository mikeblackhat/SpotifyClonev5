const { Client } = require('pg');
const fs = require('fs').promises;
const path = require('path');
require('dotenv').config({ path: '.env' });

async function runMigration() {
  console.log('🔍 Iniciando migración...');
  
  const connectionString = process.env.DATABASE_URL || process.env.DB_URL;
  
  if (!connectionString) {
    console.error('❌ Error: No se encontró la variable de entorno DATABASE_URL o DB_URL');
    process.exit(1);
  }

  console.log('🔌 Conectando a la base de datos...');
  const client = new Client({
    connectionString: connectionString,
    ssl: {
      rejectUnauthorized: false
    }
  });

  try {
    await client.connect();
    console.log('✅ Conexión exitosa a la base de datos');
    
    // Leer el archivo de migración
    const migrationPath = path.join(process.cwd(), 'migrations', '001_spotify_clone_schema.sql');
    console.log(`📖 Leyendo archivo de migración: ${migrationPath}`);
    
    const sql = await fs.readFile(migrationPath, 'utf8');
    console.log('🚀 Ejecutando migración...');
    
    // Ejecutar cada sentencia SQL por separado
    const statements = sql.split(';').filter(statement => statement.trim().length > 0);
    
    await client.query('BEGIN');
    
    for (const statement of statements) {
      if (statement.trim()) {
        console.log(`   ▶ ${statement.substring(0, 60).replace(/\s+/g, ' ').trim()}...`);
        await client.query(statement);
      }
    }
    
    await client.query('COMMIT');
    console.log('✨ ¡Migración completada con éxito!');
    
  } catch (error) {
    console.error('❌ Error durante la migración:', error);
    await client.query('ROLLBACK').catch(console.error);
    process.exit(1);
  } finally {
    await client.end();
  }
}

// Ejecutar la migración
runMigration().catch(console.error);
