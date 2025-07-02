import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/auth-options';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';
import bcrypt from 'bcrypt';

// Conectar a la base de datos
const getDb = async () => {
  const client = await clientPromise;
  return client.db();
};

export const changePassword = async (currentPassword: string, newPassword: string) => {
  try {
    const db = await getDb();
    const session = await getServerSession(authOptions) as { user?: { email?: string } } | null;
    
    if (!session?.user?.email) {
      return { success: false, error: 'No autorizado' };
    }

    // Obtener el usuario actual
    const user = await db.collection('users').findOne({
      email: session.user.email
    });

    if (!user) {
      return { success: false, error: 'Usuario no encontrado' };
    }

    // Verificar la contraseña actual
    const isPasswordValid = await bcrypt.compare(currentPassword, user.password || '');
    
    if (!isPasswordValid) {
      return { success: false, error: 'La contraseña actual es incorrecta' };
    }

    // Hashear la nueva contraseña
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // Actualizar la contraseña
    await db.collection('users').updateOne(
      { _id: user._id },
      { $set: { password: hashedPassword } }
    );

    return { success: true };
  } catch (error) {
    console.error('Error al cambiar la contraseña:', error);
    return { success: false, error: 'Error al cambiar la contraseña' };
  }
};
