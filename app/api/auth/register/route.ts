import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import bcrypt from 'bcryptjs';

// Tipos para TypeScript
interface UserData {
  email: string;
  password: string;
  username: string;
  name?: string;
}

interface UserDocument {
  _id?: any;
  email: string;
  password: string;
  name?: string;
  emailVerified: Date;
  image: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export async function POST(request: Request) {
  try {
    // Verificar que el cuerpo de la solicitud sea JSON
    if (!request.headers.get('content-type')?.includes('application/json')) {
      return NextResponse.json(
        { message: 'El contenido debe ser de tipo application/json' },
        { status: 400 }
      );
    }

    // Parsear el cuerpo de la solicitud
    let userData: UserData;
    try {
      userData = await request.json();
    } catch (error) {
      console.error('Error al analizar el JSON:', error);
      return NextResponse.json(
        { message: 'Error en el formato de los datos' },
        { status: 400 }
      );
    }

    const { email, password, username, name } = userData;
    
    // Validar los datos de entrada
    if (!email || !password || !username) {
      // Verificar si el nombre de usuario es válido
      if (username && username.trim().length < 3) {
        return NextResponse.json(
          { 
            message: 'El nombre de usuario debe tener al menos 3 caracteres',
            field: 'username',
            minLength: 3
          },
          { status: 400 }
        );
      }
      return NextResponse.json(
        { 
          message: 'El correo electrónico y la contraseña son requeridos',
          missingFields: {
            email: !email,
            password: !password
          }
        },
        { status: 400 }
      );
    }

    // Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { 
          message: 'El formato del correo electrónico no es válido',
          field: 'email'
        },
        { status: 400 }
      );
    }

    // Validar longitud de la contraseña
    if (password.length < 6) {
      return NextResponse.json(
        { 
          message: 'La contraseña debe tener al menos 6 caracteres',
          field: 'password',
          minLength: 6
        },
        { status: 400 }
      );
    }

    // Conectar a MongoDB
    let client;
    try {
      client = await clientPromise;
    } catch (dbError) {
      console.error('Error al conectar a MongoDB:', dbError);
      return NextResponse.json(
        { message: 'Error al conectar con la base de datos' },
        { status: 500 }
      );
    }
    
    const db = client.db();
    
    // Verificar si el usuario ya existe
    try {
      // Verificar si el correo ya existe
      const existingUser = await db.collection('users').findOne({
        email: email.toLowerCase()
      });
      
      if (existingUser) {
        return NextResponse.json(
          { 
            message: 'Ya existe un usuario con este correo electrónico',
            field: 'email'
          },
          { status: 400 }
        );
      }
    } catch (dbError) {
      console.error('Error al verificar usuario existente:', dbError);
      return NextResponse.json(
        { message: 'Error al verificar el usuario' },
        { status: 500 }
      );
    }

    // Verificar si el nombre de usuario ya está en uso
    const existingUserByUsername = await db.collection('users').findOne({ username: username.trim().toLowerCase() });
    if (existingUserByUsername) {
      return NextResponse.json(
        { 
          message: 'El nombre de usuario ya está en uso',
          field: 'username',
          error: 'username_taken'
        },
        { status: 400 }
      );
    }

    // Crear el nuevo usuario
    let hashedPassword;
    try {
      hashedPassword = await bcrypt.hash(password, 12);
    } catch (hashError) {
      console.error('Error al hashear la contraseña:', hashError);
      return NextResponse.json(
        { message: 'Error al procesar la contraseña' },
        { status: 500 }
      );
    }

    // Crear nombre de usuario a partir del email (antes del @) si es necesario
    const usernameFromEmail = email.split('@')[0].toLowerCase();

    const newUser = {
      email: email.toLowerCase().trim(),
      username: usernameFromEmail, // Para satisfacer el índice único
      password: hashedPassword,
      name: name?.trim() || usernameFromEmail, // Usar el nombre o el username como nombre
      emailVerified: new Date(),
      image: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    } as UserDocument;

    let result;
    try {
      result = await db.collection('users').insertOne(newUser);
    } catch (dbError) {
      console.error('Error al insertar usuario en la base de datos:', dbError);
      return NextResponse.json(
        { message: 'Error al guardar el usuario en la base de datos' },
        { status: 500 }
      );
    }

    // No devolver la contraseña en la respuesta
    const { password: _, ...userWithoutPassword } = newUser;

    return NextResponse.json(
      { 
        message: 'Usuario registrado exitosamente',
        user: {
          ...userWithoutPassword,
          _id: result.insertedId.toString()
        }
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error en el registro:', error);
    return NextResponse.json(
      { message: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
