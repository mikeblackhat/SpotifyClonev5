// @ts-check
import { neon } from '@neondatabase/serverless';
import dotenv from 'dotenv';
import * as path from 'path';
import { fileURLToPath } from 'url';

// Configurar __dirname en ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Cargar variables de entorno
dotenv.config({ path: path.join(__dirname, '../.env') });

// Verificar que DATABASE_URL esté definido
const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
  console.error('❌ Error: DATABASE_URL no está definido en el archivo .env');
  process.exit(1);
}

// Configurar el cliente de Neon
const sql = neon(databaseUrl);

async function testConnection() {
  console.log('🔍 Probando conexión a la base de datos...');
  
  try {
    // Probar la conexión con una consulta simple
    const result = await sql`SELECT version() as version`;
    console.log('✅ Conexión exitosa a la base de datos Neon');
    console.log('   Versión de PostgreSQL:', result[0]?.version || 'No disponible');
    
    // Probar listado de tablas
    console.log('\n📋 Tablas en la base de datos:');
    const tables = await sql`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `;
    
    if (tables.length > 0) {
      tables.forEach((table, index) => {
        console.log(`   ${index + 1}. ${table.table_name}`);
      });
    } else {
      console.log('   No se encontraron tablas en la base de datos');
    }
    
    // Probar consulta a la tabla de canciones si existe
    try {
      const songs = await sql`SELECT COUNT(*) as count FROM songs`;
      console.log(`\n🎵 Canciones en la base de datos: ${songs[0]?.count || 0}`);
    } catch (error) {
      console.log('\nℹ️ No se pudo acceder a la tabla de canciones:', error.message);
    }
    
  } catch (error) {
    console.error('❌ Error al conectar a la base de datos:');
    console.error('   Mensaje:', error.message);
    
    if (error.message.includes('self signed certificate')) {
      console.error('\n💡 Posible solución: Si estás usando Neon, asegúrate de que la URL de conexión incluya el parámetro sslaccept=strict');
      console.error('   Ejemplo: postgres://user:pass@host/db?sslmode=require&sslaccept=strict');
    }
    
    process.exit(1);
  }
}

// Ejecutar la prueba
testConnection();
