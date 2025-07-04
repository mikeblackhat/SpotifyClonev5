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
const pool = neon(databaseUrl);

async function runMigration() {
  console.log('🔍 Iniciando migración...');
  
  // Usar la conexión de Neon
  const connectionString = process.env.DATABASE_URL || process.env.DB_URL;
  
  if (!connectionString) {
    console.error('❌ Error: No se encontró la variable de entorno DATABASE_URL o DB_URL');
    process.exit(1);
  }

  console.log('🔌 Conectando a la base de datos...');
  
  // Configurar el pool de conexiones
  const pool = new Pool({
    connectionString: connectionString,
    ssl: {
      rejectUnauthorized: false
    }
  });

  const client = await pool.connect();

  try {
    console.log('✅ Conexión exitosa a la base de datos Neon');
    try {
      // Conectar a la base de datos usando el cliente de Neon
      console.log('✅ Conexión exitosa a la base de datos Neon');
    
    // Primero, crear todas las tablas sin restricciones
    const createTableStatements = statements.filter(s => 
      s.trim().toUpperCase().startsWith('CREATE TABLE')
    );
    
    console.log('🔨 Creando tablas...');
    for (const statement of createTableStatements) {
      if (statement.trim()) {
        console.log(`   ▶ ${statement.substring(0, 60).replace(/\s+/g, ' ').trim()}...`);
        try {
          await pool(statement);
        } catch (error) {
          if (!error.message.includes('already exists')) {
            console.error(`   ⚠️ Error creando tabla: ${error.message.split('\n')[0]}`);
            // No lanzar error para continuar con las siguientes tablas
          } else {
            console.log('   ℹ️ La tabla ya existe, continuando...');
          }
        }
      }
    }
    
    // Luego, agregar restricciones de clave foránea
    const alterTableStatements = statements.filter(s => 
      s.trim().toUpperCase().startsWith('ALTER TABLE')
    );
    
    console.log('🔗 Agregando restricciones de clave foránea...');
    for (const statement of alterTableStatements) {
      if (statement.trim()) {
        console.log(`   ▶ ${statement.substring(0, 60).replace(/\s+/g, ' ').trim()}...`);
        try {
          await pool(statement);
        } catch (error) {
          if (error.message.includes('already exists') || error.message.includes('does not exist')) {
            console.log(`   ⚠️ No se pudo agregar la restricción: ${error.message.split('\n')[0]}`);
          } else {
            console.error(`   ⚠️ Error agregando restricción: ${error.message.split('\n')[0]}`);
            // No lanzar error para continuar con las siguientes sentencias
          }
        }
      }
    }
    
    // Finalmente, agregar índices
    const indexStatements = statements.filter(s => 
      s.trim().toUpperCase().startsWith('CREATE INDEX')
    );
    
    console.log('📊 Creando índices...');
    for (const statement of indexStatements) {
      if (statement.trim()) {
        console.log(`   ▶ ${statement.substring(0, 60).replace(/\s+/g, ' ').trim()}...`);
        try {
          await pool(statement);
        } catch (error) {
          if (!error.message.includes('already exists')) {
            console.error(`   ⚠️ No se pudo crear el índice: ${error.message.split('\n')[0]}`);
            // No lanzar error para continuar con los siguientes índices
          } else {
            console.log('   ℹ️ El índice ya existe, continuando...');
          }
        }
      }
    }
    
    // Primero, obtener el contenido completo del archivo SQL
    console.log('📝 Procesando el script SQL...');
    const sqlFilePath = path.join(__dirname, '../migrations/001_spotify_clone_schema.sql');
    const fullSql = await fs.readFile(sqlFilePath, 'utf8');
    
    // Dividir el SQL en bloques que terminan con ; o $$
    const sqlBlocks = [];
    let currentBlock = '';
    let inDollarQuote = false;
    
    for (let i = 0; i < fullSql.length; i++) {
      const char = fullSql[i];
      const nextChar = fullSql[i + 1] || '';
      
      // Manejar bloques con $$ (para funciones PL/pgSQL)
      if (char === '$' && nextChar === '$') {
        inDollarQuote = !inDollarQuote;
        currentBlock += '$$';
        i++; // Saltar el siguiente $
        continue;
      }
      
      currentBlock += char;
      
      // Si estamos en un bloque con $$, continuar hasta encontrar el cierre
      if (inDollarQuote) continue;
      
      // Si encontramos un ; fuera de un bloque $$, es el final de una sentencia
      if (char === ';') {
        const trimmedBlock = currentBlock.trim();
        if (trimmedBlock) {
          // Ignorar comentarios y líneas vacías
          if (!trimmedBlock.startsWith('--') && 
              !trimmedBlock.startsWith('/*') &&
              trimmedBlock !== ';') {
            sqlBlocks.push(trimmedBlock);
          }
        }
        currentBlock = '';
      }
    }
    
    // Ejecutar cada bloque SQL
    console.log('🚀 Ejecutando bloques SQL...');
    for (const block of sqlBlocks) {
      if (!block.trim()) continue;
      
      console.log(`   ▶ ${block.substring(0, 60).replace(/\s+/g, ' ').trim()}...`);
      try {
        await pool(block);
      } catch (error) {
        console.error(`   ⚠️ Error en el bloque SQL: ${error.message.split('\n')[0]}`);
        // Continuar con los siguientes bloques
      }
    }
    
    await client.query('COMMIT');
    console.log('✨ ¡Migración completada con éxito!');
    
  } catch (error) {
    console.error('❌ Error durante la migración:', error.message);
    try {
      await client.query('ROLLBACK');
      console.log('🔙 Se realizó ROLLBACK de la transacción');
    } catch (rollbackError) {
      console.error('Error al hacer ROLLBACK:', rollbackError.message);
    }
    process.exit(1);
  } finally {
    client.release();
    await pool.end();
    console.log('🔌 Conexión cerrada');
  }
}

// Ejecutar la migración
runMigration().catch(console.error);
