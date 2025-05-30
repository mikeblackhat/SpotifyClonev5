import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/auth-options';
import clientPromise from '@/lib/mongodb';
import { IUser } from '@/models/User';
import { Session } from 'next-auth';
import { ObjectId } from 'mongodb';

// Conectar a la base de datos
const getDb = async () => {
  const client = await clientPromise;
  return client.db();
};

// Obtener el usuario actual basado en la sesión
export const getCurrentUser = async (): Promise<IUser | null> => {
  try {
    const db = await getDb();
    const session = await getServerSession(authOptions) as Session & { user?: { email?: string } };
    
    if (!session?.user?.email) {
      return null;
    }

    // Usar any temporalmente para evitar problemas de tipos
    const userDoc = await db.collection('users').findOne({
      email: session.user.email
    }) as any;

    if (!userDoc) return null;
    
    // Convertir el documento de MongoDB a un objeto plano
    const user = { ...userDoc };
    // Asegurarse de que _id sea string
    user._id = user._id?.toString() || '';
    return user as IUser;
  } catch (error) {
    console.error('Error al obtener el usuario actual:', error);
    return null;
  }
};

// Actualizar el perfil del usuario
export const updateUserProfile = async (userId: string, updateData: Partial<IUser>): Promise<{ success: boolean; data?: IUser; error?: string }> => {
  try {
    const db = await getDb();
    
    // Filtrar solo los campos permitidos para actualizar
    const allowedUpdates = ['name', 'username', 'displayName', 'birthDate', 'gender', 'country', 'bio'];
    const updates: any = {};
    
    // Manejar campos especiales
    if ('birthDate' in updateData && updateData.birthDate) {
      updates.birthDate = new Date(updateData.birthDate);
    }
    
    // Agregar otros campos permitidos
    for (const key of allowedUpdates) {
      if (key !== 'birthDate' && key in updateData) {
        updates[key] = updateData[key as keyof IUser];
      }
    }

    // Usar any temporalmente para evitar problemas de tipos
    const result = await db.collection('users').findOneAndUpdate(
      { _id: new ObjectId(userId) },
      { $set: updates },
      { returnDocument: 'after' }
    ) as any;

    if (!result) {
      return { success: false, error: 'Usuario no encontrado' };
    }

    // Convertir el resultado a IUser
    const updatedUser = { 
      ...result, 
      _id: result._id?.toString() || '' 
    } as IUser;
    
    return { success: true, data: updatedUser };
  } catch (error) {
    console.error('Error al actualizar el perfil:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Error al actualizar el perfil' 
    };
  }
};

// Obtener perfil de usuario por ID
export const getUserById = async (userId: string): Promise<IUser | null> => {
  try {
    const db = await getDb();
    
    // Usar any temporalmente para evitar problemas de tipos
    const userDoc = await db.collection('users').findOne({
      _id: new ObjectId(userId)
    }) as any;
    
    if (!userDoc) return null;
    
    // Convertir el documento de MongoDB a un objeto plano
    const user = { ...userDoc };
    // Asegurarse de que _id sea string
    user._id = user._id?.toString() || '';
    return user as IUser;
  } catch (error) {
    console.error('Error al obtener el usuario por ID:', error);
    return null;
  }
};
