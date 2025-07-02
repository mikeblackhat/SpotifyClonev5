const { MongoClient } = require('mongodb');
const bcrypt = require('bcryptjs');
require('dotenv').config({ path: '.env.local' });

async function registerUser() {
  const uri = process.env.MONGODB_URI;
  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log('Conectado a MongoDB');

    const db = client.db();
    const usersCollection = db.collection('users');

    // Generar un nombre de usuario único basado en la marca de tiempo
    const timestamp = Date.now();
    const username = `user_${timestamp}`;
    
    // Datos del usuario a registrar
    const userData = {
      name: 'Usuario de Prueba',
      email: 'prueba@example.com',
      username: username,
      password: await bcrypt.hash('Prueba123', 12), // Hasheamos la contraseña
      birthDate: new Date('1990-01-01'),
      gender: 'other',
      emailVerified: new Date(),
      image: null,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    // Verificar si el usuario ya existe
    const existingUser = await usersCollection.findOne({ email: userData.email });
    if (existingUser) {
      console.log('El usuario ya existe en la base de datos');
      return;
    }

    // Insertar el nuevo usuario
    const result = await usersCollection.insertOne(userData);
    console.log('Usuario registrado exitosamente:');
    console.log(`ID: ${result.insertedId}`);
    console.log(`Email: ${userData.email}`);
    console.log('Contraseña: Prueba123');

  } catch (error) {
    console.error('Error al registrar el usuario:', error);
  } finally {
    await client.close();
    console.log('Conexión cerrada');
  }
}

// Ejecutar la función
registerUser();
