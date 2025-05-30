import { MongoDBAdapter } from '@auth/mongodb-adapter';
import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';
import clientPromise from '@/lib/mongodb';
import bcrypt from 'bcryptjs';
import type { Adapter } from 'next-auth/adapters';

// Tipos para TypeScript
type User = {
  id: string;
  email?: string | null;
  name?: string | null;
  image?: string | null;
  provider?: string;
  password?: string;
};

type Session = {
  user: {
    id: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
    provider?: string;
  };
  expires: string;
};

type JWT = {
  id: string;
  provider?: string;
};

// Configuración de autenticación
const authOptions: any = {
  // Configure one or more authentication providers
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
      allowDangerousEmailAccountLinking: true,
    }),
    CredentialsProvider({
      id: 'credentials',
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      } as const,
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Por favor ingresa tu correo y contraseña');
        }
        
        const { email, password } = credentials as { email: string; password: string };

        try {
          const client = await clientPromise;
          const db = client.db();
          const user = await db.collection<User>('users').findOne({ 
            email: credentials.email 
          });

          if (!user) {
            throw new Error('No existe un usuario con este correo');
          }

          const userPassword = user.password;
          if (typeof userPassword !== 'string') {
            throw new Error('Contraseña no válida');
          }
          
          // Asegurarse de que la contraseña sea una cadena
          const passwordToCompare = userPassword.toString();
          const passwordToCheck = credentials.password.toString();
          // Usar la versión con promesas de bcrypt
          let isPasswordValid = false;
          try {
            isPasswordValid = await bcrypt.compare(passwordToCheck, passwordToCompare);
          } catch (err) {
            console.error('Error al comparar contraseñas:', err);
            throw new Error('Error al verificar la contraseña');
          }

          if (!isPasswordValid) {
            throw new Error('Contraseña incorrecta');
          }

          // Return user object without the password
          const { password, ...userWithoutPassword } = user as any;
          return {
            id: user._id.toString(),
            email: user.email,
            name: user.name,
            image: user.image
          };
        } catch (error) {
          console.error('Error during authorization:', error);
          throw error;
        }
      },
    }),
  ],
  
  // Configuración del adaptador de MongoDB para NextAuth v4
  // Usamos directamente clientPromise que ya es una promesa que resuelve a un MongoClient
  adapter: MongoDBAdapter(clientPromise),
  
  // Session configuration
  session: {
    strategy: 'jwt',
  },
  
  // JWT configuration
  jwt: {
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  
  secret: process.env.NEXTAUTH_SECRET,
  
  // Pages configuration
  pages: {
    signIn: '/auth/signin',
    error: '/auth/signin',
  },
  
  // Enable debug messages in the console if you are having problems
  debug: process.env.NODE_ENV === 'development',
  
  // Callbacks
  callbacks: {
    async signIn({ user, account }: { user: any; account: any }) {
      // Permitir el inicio de sesión con Google sin verificación adicional
      if (account?.provider === 'google') {
        return true;
      }
      
      // Para credenciales, ya se maneja en la función authorize
      return true;
    },
    async jwt({ token, user, account }: { token: any; user?: any; account?: any }) {
      // Pasar el ID de usuario al token
      if (user) {
        token.id = user.id;
        token.provider = account?.provider;
      }
      return token;
    },
    async session({ session, token }: { session: any; token: any }) {
      // Pasar el ID de usuario a la sesión
      if (session.user) {
        session.user.id = token.id;
        session.user.provider = token.provider;
      }
      return session;
    },
  },
};

export { authOptions };
