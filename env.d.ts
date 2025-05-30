namespace NodeJS {
  interface ProcessEnv {
    // MongoDB
    MONGODB_URI: string;
    MONGODB_DB_NAME?: string;
    
    // NextAuth
    NEXTAUTH_URL: string;
    NEXTAUTH_SECRET: string;
    
    // OAuth Providers (opcionales)
    GOOGLE_CLIENT_ID?: string;
    GOOGLE_CLIENT_SECRET?: string;
    FACEBOOK_CLIENT_ID?: string;
    FACEBOOK_CLIENT_SECRET?: string;
    APPLE_CLIENT_ID?: string;
    APPLE_CLIENT_SECRET?: string;
    
    // Entorno
    NODE_ENV: 'development' | 'production' | 'test';
  }
}
