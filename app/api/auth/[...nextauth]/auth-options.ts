import { MongoDBAdapter } from '@auth/mongodb-adapter';
import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';
import clientPromise from '@/config/lib/mongodb'; // Updated path
import bcrypt from 'bcryptjs';
import type { Adapter } from 'next-auth/adapters';

// Importar los tipos de NextAuth
import type { DefaultUser, DefaultSession } from 'next-auth';
import type { JWT as DefaultJWT } from 'next-auth/jwt';

// Tipos para usar en este archivo
type User = DefaultUser & {
  id: string;
  plan?: string;
  provider?: string;
  password?: string;
};

type Session = DefaultSession & {
  user: {
    id: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
    plan?: string;
    provider?: string;
  };
};

type JWT = DefaultJWT & {
  id: string;
  plan?: string;
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
  
  // Configuración del adaptador de MongoDB para NextAuth v4 con manejo personalizado
  adapter: {
    ...MongoDBAdapter(clientPromise, {
      databaseName: process.env.MONGODB_DB,
    }),
    // Sobrescribir el método createUser para manejar el campo username
    async createUser(user: User & { email?: string | null; emailVerified?: Date | null; name?: string | null; image?: string | null }) {
      const client = await clientPromise;
      const db = client.db();
      
      // Generar un nombre de usuario único basado en el email
      const baseUsername = user.email?.split('@')[0] || `user${Date.now()}`;
      let username = baseUsername;
      let counter = 1;
      
      // Verificar si el nombre de usuario ya existe
      while (await db.collection('users').findOne({ username })) {
        username = `${baseUsername}${counter}`;
        counter++;
      }
      
      // Crear el usuario con un nombre de usuario único
      const newUser = {
        ...user,
        username,
        plan: 'free',
        provider: 'google',
        emailVerified: user.emailVerified || new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      
      const result = await db.collection('users').insertOne(newUser);
      return {
        ...newUser,
        id: result.insertedId.toString(),
      };
    },
  },
  
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
  
  // Eventos
  events: {
    async createUser({ user, account, profile, isNewUser }: { 
      user: User & { emailVerified?: Date | null };
      account: any;
      profile?: any;
      isNewUser?: boolean;
    }) {
      // Este evento ya no es necesario ya que manejamos la creación en el callback de signIn
      // Se mantiene por compatibilidad pero no hace nada
      return;
    },
    
    async signIn({ user, account, profile, isNewUser }: { 
      user: User;
      account: any;
      profile?: any;
      isNewUser?: boolean;
    }) {
      // Este callback se ejecuta después de un inicio de sesión exitoso
      if (isNewUser && account?.provider) {
        console.log(`Nuevo usuario creado con ${account.provider}`);
      }
      return true;
    },
    
    async error(error: Error) {
      console.error('Error de autenticación:', error);
    }
  },
  
  // Callbacks
  callbacks: {
    async signIn({ user, account, profile, email, credentials }: { 
      user: User;
      account: any;
      profile?: any;
      email?: { verificationRequest?: boolean };
      credentials?: Record<string, any>;
    }) {
      // Si es una solicitud de verificación de correo, permitir
      if (email?.verificationRequest) return true;
      
      // Si no es un proveedor OAuth, permitir (manejado por el adaptador)
      if (!account?.provider || account.provider === 'credentials') return true;
      try {
        // Solo procesar para proveedores OAuth
        if (account?.provider && account.provider !== 'credentials') {
          const client = await clientPromise;
          const db = client.db();
          
          // Verificar si el usuario ya existe
          const existingUser = await db.collection('users').findOne({ email: user.email });
          
          if (existingUser) {
            // Actualizar la información del usuario existente
            await db.collection('users').updateOne(
              { email: user.email },
              {
                $set: {
                  name: user.name,
                  image: profile?.picture || user.image,
                  provider: account.provider,
                  updatedAt: new Date(),
                }
              }
            );
          } else {
            // Crear un nuevo usuario si no existe
            await db.collection('users').insertOne({
              email: user.email,
              name: user.name,
              image: profile?.picture || user.image,
              emailVerified: new Date(),
              plan: 'free',
              provider: account.provider,
              createdAt: new Date(),
              updatedAt: new Date(),
            });
          }
        }
        
        return true;
      } catch (error) {
        console.error('Error en el callback de signIn:', error);
        return false;
      }
    },
    async jwt({ token, user, account }: { token: any; user?: any; account?: any }) {
      // Pasar el ID de usuario al token
      if (user) {
        token.id = user.id;
        token.provider = account?.provider;
      }
      return token;
    },
    async session({ session, token, user }: { session: Session; token: JWT; user?: any }) {
      try {
        // Verificar que exista el usuario en la sesión y tenga email
        if (!session?.user?.email) {
          console.warn('No se encontró el correo electrónico en la sesión');
          return session;
        }
        
        const client = await clientPromise;
        const db = client.db(process.env.MONGODB_DB || '');
        
        // Normalizar el correo electrónico a minúsculas
        const email = session.user.email.toLowerCase();
        
        // Buscar el usuario por email en la colección de usuarios
        const dbUser = await db.collection('users').findOne({ email });
        
        if (!dbUser) {
          console.warn(`Usuario con email ${email} no encontrado en la base de datos`);
          return session;
        }
        
        // Asegurarse de que el ID sea una cadena
        const userId = dbUser._id?.toString() || token.id || user?.id || '';
        
        // Actualizar la información del usuario en la sesión
        if (session.user) {
          session.user.id = userId;
          
          // Si el usuario no tiene plan, establecer uno por defecto
          if (dbUser.plan === undefined || dbUser.plan === null) {
            const defaultPlan = 'free';
            await db.collection('users').updateOne(
              { _id: dbUser._id },
              { 
                $set: { 
                  plan: defaultPlan, 
                  provider: token.provider || 'google',
                  updatedAt: new Date() 
                } 
              }
            );
            dbUser.plan = defaultPlan;
            console.log(`Plan por defecto (${defaultPlan}) asignado al usuario ${email}`);
          }
          
          // Si el usuario no tiene proveedor, establecerlo
          if (!dbUser.provider) {
            const provider = token.provider || 'google';
            await db.collection('users').updateOne(
              { _id: dbUser._id },
              { 
                $set: { 
                  provider: provider,
                  updatedAt: new Date()
                } 
              }
            );
            dbUser.provider = provider;
            console.log(`Proveedor ${provider} asignado al usuario ${email}`);
          }
          
          // Actualizar el token con la información del plan
          token.plan = dbUser.plan || 'free';
          token.provider = dbUser.provider || 'google';
          
          // Actualizar la sesión con los datos del usuario
          session.user = {
            ...session.user,
            id: userId,
            plan: dbUser.plan || 'free',
            provider: dbUser.provider || 'google',
          };
          
          // Log para depuración
          console.log('Datos de sesión actualizados para el usuario:', {
            email: session.user.email,
            plan: session.user.plan,
            provider: session.user.provider,
            id: session.user.id
          });
        }
        
        return session;
      } catch (error) {
        console.error('Error en el callback de sesión:', error);
        return session;
      }
    },
  },
};

export { authOptions };
