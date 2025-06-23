'use client';

import { useState } from 'react';
import { signIn, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';

interface RegisterData {
  email: string;
  password: string;
  username: string;
  name: string;
}

interface UseAuthProps {
  onSuccess?: () => void;
  onError?: (error: string) => void;
  onRegisterSuccess?: (data: any) => void;
}

export function useAuth({ onSuccess, onError, onRegisterSuccess }: UseAuthProps = {}) {
  const [isLoading, setIsLoading] = useState(false);
  const [isSocialLoading, setIsSocialLoading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleError = (error: any, defaultMessage: string) => {
    console.error('Auth error:', error);
    const errorMessage = error?.message || defaultMessage;
    setError(errorMessage);
    onError?.(errorMessage);
    return errorMessage;
  };

  const handleSignIn = async (email: string, password: string) => {
    if (!email || !password) {
      return 'Por favor ingresa tu correo y contraseña';
    }

    setIsLoading(true);
    setError(null);

    try {
      const result = await signIn('credentials', {
        redirect: false,
        email,
        password,
      });

      if (result?.error) {
        return handleError(result.error, 'Credenciales inválidas. Por favor, inténtalo de nuevo.');
      }

      onSuccess?.();
      return null;
    } catch (error) {
      return handleError(error, 'Ocurrió un error al iniciar sesión. Por favor, inténtalo de nuevo.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (data: RegisterData) => {
    setIsLoading(true);
    setError(null);

    try {
      // 1. Registrar al usuario en la base de datos
      const registerResponse = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const registerData = await registerResponse.json();

      if (!registerResponse.ok) {
        throw new Error(registerData.message || 'Error al registrar el usuario');
      }

      // 2. Iniciar sesión automáticamente después del registro exitoso
      try {
        const signInResult = await signIn('credentials', {
          redirect: false,
          email: data.email,
          password: data.password,
        });

        if (signInResult?.error) {
          // Si hay un error al iniciar sesión, devolver éxito pero sin iniciar sesión
          onRegisterSuccess?.(registerData);
          return { success: true, requiresLogin: true };
        }
        
        // Éxito al registrar e iniciar sesión
        onSuccess?.();
        return { success: true };
      } catch (signInError) {
        // Si hay un error al iniciar sesión, pero el registro fue exitoso
        onRegisterSuccess?.(registerData);
        return { success: true, requiresLogin: true };
      }
      
    } catch (error: any) {
      console.error('Error en el registro:', error);
      
      // Manejar diferentes tipos de errores
      let errorMessage = 'Ocurrió un error al registrarte. Por favor, inténtalo de nuevo.';
      
      if (error.message.includes('E11000')) {
        if (error.message.includes('email')) {
          errorMessage = 'Ya existe una cuenta con este correo electrónico';
        } else if (error.message.includes('username')) {
          errorMessage = 'El nombre de usuario ya está en uso';
        } else {
          errorMessage = 'El usuario ya existe';
        }
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      handleError(error, errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialSignIn = async (provider: string) => {
    setIsSocialLoading(provider);
    setError(null);

    try {
      const result = await signIn(provider, { callbackUrl: '/' });
      
      if (result?.error) {
        handleError(result.error, `Error al iniciar sesión con ${provider}. Por favor, inténtalo de nuevo.`);
      } else {
        onSuccess?.();
      }
    } catch (error) {
      handleError(error, `Error al iniciar sesión con ${provider}. Por favor, inténtalo de nuevo.`);
    } finally {
      setIsSocialLoading(null);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut({ redirect: false });
      router.push('/auth/signin');
    } catch (error) {
      handleError(error, 'Error al cerrar sesión. Por favor, inténtalo de nuevo.');
    }
  };

  return {
    // States
    isLoading,
    isSocialLoading,
    error,
    
    // Handlers
    handleSignIn,
    handleSocialSignIn,
    handleSignOut,
    handleRegister,
    
    // Setters
    setError,
  };
}

export default useAuth;
