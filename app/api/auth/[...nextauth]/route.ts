import NextAuth from 'next-auth';
import { authOptions } from './auth-options';

// Manejador de autenticación
const handler = NextAuth({
  ...authOptions,
  callbacks: {
    ...authOptions.callbacks,
    async signIn({ account }) {
      // Permitir el inicio de sesión con Google sin verificación adicional
      if (account?.provider === 'google') {
        return true;
      }
      // Para credenciales, ya se maneja en la función authorize
      return true;
    },
    async redirect({ url, baseUrl }) {
      // Si la URL es relativa, agregar la URL base
      if (url.startsWith('/')) return `${baseUrl}${url}`;
      // Si la URL es absoluta y del mismo origen, permitirla
      try {
        if (new URL(url).origin === baseUrl) return url;
      } catch (e) {
        // Si hay un error al analizar la URL, devolver la URL base
        return baseUrl;
      }
      // Por defecto, devolver la URL base
      return baseUrl;
    },
  },
});

export { handler as GET, handler as POST };
