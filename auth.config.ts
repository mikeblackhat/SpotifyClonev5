import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { MongoDBAdapter } from '@auth/mongodb-adapter';
import clientPromise from './lib/mongodb';
import bcrypt from 'bcryptjs';
import type { Adapter } from 'next-auth/adapters';

// Extend the built-in session types
declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
    };
  }

  interface User {
    id: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
  }
}

// @ts-ignore - Configuración de NextAuth
export const authOptions = {
  // Configure one or more authentication providers
  providers: [
    Credentials({
      id: 'credentials',
      name: 'Credentials',
      type: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials: any) {
        console.log('Iniciando proceso de autorización con credenciales:', {
          email: credentials?.email ? 'presente' : 'ausente',
          password: credentials?.password ? 'presente' : 'ausente'
        });

        if (!credentials?.email || !credentials?.password) {
          console.error('Faltan credenciales');
          throw new Error('Por favor ingresa tu correo y contraseña');
        }

        try {
          console.log('Conectando a la base de datos...');
          const client = await clientPromise;
          console.log('Conexión a la base de datos exitosa');
          
          const db = client.db();
          console.log('Buscando usuario con email:', credentials.email);
          
          const user = await db.collection('users').findOne({ email: credentials.email });
          console.log('Resultado de la búsqueda de usuario:', user ? 'usuario encontrado' : 'usuario no encontrado');

          if (!user) {
            console.error('No se encontró ningún usuario con el correo:', credentials.email);
            throw new Error('No existe un usuario con este correo');
          }

          // Asegurarse de que user.password sea una cadena
          const userPassword = user.password || '';
          console.log('Verificando contraseña...');
          const isPasswordValid = await bcrypt.compare(credentials.password, userPassword);
          console.log('Resultado de la verificación de contraseña:', isPasswordValid);

          if (!isPasswordValid) {
            console.error('Contraseña incorrecta para el usuario:', credentials.email);
            throw new Error('Contraseña incorrecta');
          }

          // Return user object without the password
          const { password, ...userWithoutPassword } = user as any;
          console.log('Usuario autorizado correctamente:', { id: user._id.toString(), email: user.email });
          return {
            id: user._id.toString(),
            email: user.email,
            name: user.name,
            image: user.image
          };
        } catch (error) {
          console.error('Error durante la autorización:', error);
          // Asegurarse de que el error sea serializable
          const errorMessage = error instanceof Error ? error.message : 'Ocurrió un error durante la autenticación';
          throw new Error(JSON.stringify({ error: errorMessage }));
        }
      },
    }),
  ],
  
  // Use MongoDB adapter to persist user data
  adapter: MongoDBAdapter(clientPromise, {
    databaseName: process.env.MONGODB_DB_NAME,
  }) as Adapter,
  
  // Session configuration
  session: {
    strategy: 'jwt' as const,
  } as const,
  
  // JWT configuration
  jwt: {
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  
  secret: process.env.NEXTAUTH_SECRET,
  
  // Pages configuration
  pages: {
    signIn: '/auth/signin',
  },
  
  // Enable debug messages in the console if you are having problems
  debug: process.env.NODE_ENV === 'development',
  
  // Callback URLs
  callbacks: {
    async jwt({ token, user }: any) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }: any) {
      if (session?.user) {
        session.user.id = token.id;
      }
      return session;
    },
  },
  
  // Cookies configuration
  cookies: {
    sessionToken: {
      name: `__Secure-next-auth.session-token`,
      options: {
        httpOnly: true,
        sameSite: 'lax' as const,
        path: '/',
        secure: process.env.NODE_ENV === 'production',
      },
    },
  },
};

// Export the auth options for use in API routes
export default authOptions;

// Create the NextAuth handler for API routes
const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
