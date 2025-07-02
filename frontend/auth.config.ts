import NextAuth, { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';
import { MongoDBAdapter } from '@next-auth/mongodb-adapter';
import clientPromise from './lib/mongodb';
import bcrypt from 'bcryptjs';

// Extend built-in session types
declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      plan?: string;
      provider?: string;
    };
  }

  interface User {
    id: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
  }

  interface Account {
    provider: string;
    type: 'oauth' | 'email' | 'credentials';
    [key: string]: any;
  }

  interface Profile {
    email?: string;
    name?: string;
    image?: string;
  }
}

export const authOptions: NextAuthOptions = {
  // Configure authentication providers
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
      authorization: {
        params: {
          prompt: 'consent',
          access_type: 'offline',
          response_type: 'code'
        }
      }
    }),
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Please enter your email and password');
        }

        try {
          const client = await clientPromise;
          const db = client.db(process.env.MONGODB_DB_NAME || 'spotify-clone');
          
          const user = await db.collection('users').findOne({ 
            email: credentials.email 
          });
          
          if (!user) {
            throw new Error('No user found with this email');
          }

          const isValid = await bcrypt.compare(
            credentials.password, 
            user.password || ''
          );
          
          if (!isValid) {
            throw new Error('Incorrect password');
          }

          return {
            id: user._id.toString(),
            email: user.email,
            name: user.name,
            image: user.image
          };
        } catch (error) {
          console.error('Authentication error:', error);
          throw new Error('Authentication failed');
        }
      }
    })
  ],
  
  // Use MongoDB adapter
  adapter: MongoDBAdapter(clientPromise, {
    databaseName: process.env.MONGODB_DB_NAME || 'spotify-clone',
  }),
  
  // Session configuration
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
    updateAge: 24 * 60 * 60, // Actualizar la sesión cada 24 horas
  },
  jwt: {
    secret: process.env.NEXTAUTH_SECRET,
    maxAge: 30 * 24 * 60 * 60, // 30 días
  },
  
  // Callbacks
  callbacks: {
    async session({ session, token, user }) {
      if (session?.user) {
        // Asegurarse de que el ID del usuario esté disponible en la sesión
        session.user.id = token.sub || token.id || '';
        
        // Agregar campos adicionales del usuario a la sesión
        if (token) {
          session.user.name = token.name || null;
          session.user.email = token.email || null;
          session.user.image = token.picture || null;
          session.user.plan = token.plan || 'free'; // Establecer 'free' como valor por defecto
          session.user.provider = token.provider || 'credentials';
        }
      }
      return session;
    },
    async jwt({ token, user, account, profile }) {
      // Pasar los datos del usuario al token
      if (user) {
        token.id = user.id;
        token.name = user.name;
        token.email = user.email;
        // Incluir el plan del usuario si está disponible
        if ('plan' in user) {
          token.plan = user.plan;
        } else {
          token.plan = 'free'; // Valor por defecto
        }
      }
      
      // Para proveedores OAuth
      if (account && profile) {
        token.provider = account.provider;
      }
      
      return token;
    },
    async signIn({ user, account, profile }) {
      try {
        const client = await clientPromise;
        const db = client.db(process.env.MONGODB_DB_NAME || 'spotify-clone');
        
        // Verificar si el usuario ya existe
        const existingUser = await db.collection('users').findOne({ 
          email: user.email 
        });
        
        if (!existingUser) {
          // Crear un nuevo usuario si no existe
          const newUser = {
            email: user.email,
            name: user.name,
            image: user.image || null,
            emailVerified: new Date(),
            provider: account?.provider || 'credentials',
            role: 'user',
            isActive: true,
            lastLogin: new Date(),
            preferences: {},
            createdAt: new Date(),
            updatedAt: new Date(),
          };
          
          // Si es un registro con credenciales, ya se creó el usuario en el endpoint de registro
          if (account?.provider === 'credentials') {
            return true;
          }
          
          // Para proveedores OAuth, insertar el nuevo usuario
          await db.collection('users').insertOne(newUser);
        } else {
          // Actualizar la última vez que inició sesión
          await db.collection('users').updateOne(
            { email: user.email },
            { $set: { lastLogin: new Date() } }
          );
        }
        
        return true;
      } catch (error) {
        console.error('Error en la función signIn:', error);
        return false;
      }
    }
  },
  
  // Custom pages
  pages: {
    signIn: '/auth/signin',
  },
  
  // Debug mode in development
  debug: process.env.NODE_ENV === 'development',
  
  // Secret for signing tokens
  secret: process.env.NEXTAUTH_SECRET || 'your-secret-key-change-this-in-production',
  
  // Cookie settings
  cookies: {
    sessionToken: {
      name: `__Secure-next-auth.session-token`,
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: process.env.NODE_ENV === 'production'
      }
    }
  },
  
  // Theme settings
  theme: {
    colorScheme: 'dark',
  },
  
  // Logger configuration
  logger: {
    error(code: string, metadata: any) {
      console.error(code, metadata);
    },
    warn(code: string) {
      console.warn(code);
    },
    debug(code: string, metadata: any) {
      console.debug(code, metadata);
    }
  }
};

export default NextAuth(authOptions);
