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
    };
  }

  interface User {
    id: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
  }

  interface Account {
    provider?: string;
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
  },
  
  // Callbacks
  callbacks: {
    async session({ session, token }) {
      if (session?.user) {
        session.user.id = token.sub || token.id || '';
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async signIn({ user, account }) {
      if (account?.provider === 'google') {
        try {
          const client = await clientPromise;
          const db = client.db(process.env.MONGODB_DB_NAME || 'spotify-clone');
          
          // Check if user already exists
          const existingUser = await db.collection('users').findOne({ 
            email: user.email 
          });
          
          if (!existingUser) {
            // Create new user if doesn't exist
            await db.collection('users').insertOne({
              email: user.email,
              name: user.name,
              image: user.image,
              emailVerified: new Date(),
              createdAt: new Date(),
              updatedAt: new Date()
            });
          }
          
          return true;
        } catch (error) {
          console.error('Error in signIn callback:', error);
          return false;
        }
      }
      return true;
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
