import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/auth-options';
import { updateUserProfile, getCurrentUser } from '@/services/userService';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

// Función auxiliar para obtener la base de datos
async function getDb() {
  const client = await clientPromise;
  return client;
}

export async function GET() {
  try {
    const user = await getCurrentUser();
    
    if (!user) {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      );
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error('Error al obtener el perfil:', error);
    return NextResponse.json(
      { error: 'Error al obtener el perfil' },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const session = await getServerSession(authOptions) as { user?: { email?: string } } | null;
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      );
    }

    // Obtener el usuario actual para asegurarnos de que existe
    const user = await getCurrentUser();
    
    if (!user || !user._id) {
      return NextResponse.json(
        { error: 'Usuario no encontrado' },
        { status: 404 }
      );
    }
    
    // Asegurarnos de que el ID sea un string
    const userId = typeof user._id === 'string' ? user._id : user._id.toString();

    const data = await request.json();
    
    // Validar el nombre de usuario
    if (data.username && data.username.trim().length < 3) {
      return NextResponse.json(
        { error: 'El nombre de usuario debe tener al menos 3 caracteres' },
        { status: 400 }
      );
    }
    
    // Validar formato del nombre de usuario (solo letras, números y guiones bajos)
    const usernameRegex = /^[a-zA-Z0-9_]+$/;
    if (data.username && !usernameRegex.test(data.username)) {
      return NextResponse.json(
        { error: 'El nombre de usuario solo puede contener letras, números y guiones bajos (_)' },
        { status: 400 }
      );
    }
    
    // Verificar si el nombre de usuario ya está en uso
    if (data.username && data.username !== user.username) {
      const db = (await getDb()).db();
      const existingUser = await db.collection('users').findOne({ 
        username: data.username.trim().toLowerCase(),
        _id: { $ne: new ObjectId(userId) } // Excluir al usuario actual
      });
      
      if (existingUser) {
        return NextResponse.json(
          { error: 'El nombre de usuario ya está en uso' },
          { status: 400 }
        );
      }
    }
    
    // Preparar los datos para actualizar
    const updateData = {
      ...(data.name !== undefined && { name: data.name }),
      ...(data.username !== undefined && { 
        username: data.username.trim().toLowerCase() 
      }),
      ...(data.birthDate !== undefined && { 
        birthDate: data.birthDate 
      }),
      ...(data.gender !== undefined && { 
        gender: data.gender || 'prefiero-no-decir' 
      }),
      ...(data.country !== undefined && { 
        country: data.country || 'MX' 
      }),
      ...(data.bio !== undefined && { 
        bio: data.bio 
      })
    };

    // Actualizar el perfil
    const result = await updateUserProfile(userId, updateData);
    
    if (!result.success) {
      console.error('Error al actualizar el perfil:', result.error);
      return NextResponse.json(
        { error: result.error || 'Error al actualizar el perfil' },
        { status: 400 }
      );
    }
    
    console.log('Perfil actualizado correctamente:', result.data);

    // Devolver los datos actualizados
    return NextResponse.json({
      ...result.data,
      // Asegurarse de que _id sea string
      _id: result.data?._id?.toString() || ''
    });
  } catch (error) {
    console.error('Error al actualizar el perfil:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
