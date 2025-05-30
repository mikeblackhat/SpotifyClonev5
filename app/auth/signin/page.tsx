'use client';

import { signIn, useSession } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { FormEvent, useEffect, useState } from 'react';
import { FaEnvelope, FaLock } from 'react-icons/fa';
import { SocialButtons } from '@/components/auth/SocialButtons';

export default function SignInPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: session } = useSession();
  
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(searchParams?.get('error') || null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSocialLoading, setIsSocialLoading] = useState(false);
  
  // Redirect if already logged in
  useEffect(() => {
    if (session) {
      router.push('/');
    }
  }, [session, router]);

  const handleSocialError = (message: string) => {
    setError(message);
  };
  
  const handleEmailLogin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);
    
    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    
    try {
      const result = await signIn('credentials', { 
        redirect: false,
        email, 
        password,
        callbackUrl: '/',
      });
      
      if (result?.error) {
        try {
          const errorData = JSON.parse(result.error);
          setError(errorData.error || 'Correo o contraseña incorrectos');
        } catch (e) {
          setError(result.error || 'Correo o contraseña incorrectos');
        }
      } else if (result?.url) {
        router.push(result.url);
        router.refresh();
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
      console.error('Error al iniciar sesión:', error);
      setError(`Ocurrió un error al iniciar sesión: ${errorMessage}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="flex-1 flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full bg-black/50 backdrop-blur-md rounded-lg p-8 border border-neutral-800">
        <h1 className="text-3xl font-bold text-center mb-8">Inicia sesión en Spotify</h1>
        
        <div className="space-y-4">
          <SocialButtons 
            isLoading={isSocialLoading} 
            onError={handleSocialError}
            buttonClassName={isLoading ? 'opacity-70 cursor-not-allowed' : ''}
          /> 
          
          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-700"></div>
            </div>
            <div className="relative flex justify-center">
              <span className="px-2 bg-black text-gray-400 text-sm">o</span>
            </div>
          </div>
          
          <form onSubmit={handleEmailLogin} className="space-y-4">
            {error && (
              <div className="bg-red-500/20 border border-red-500 text-red-100 px-4 py-3 rounded-md text-sm">
                {error}
              </div>
            )}
            
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">
                Correo electrónico
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaEnvelope className="text-gray-400" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="w-full bg-neutral-800 border border-neutral-700 rounded-md py-3 pl-10 pr-4 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Correo electrónico"
                  disabled={isLoading}
                />
              </div>
            </div>
            
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-1">
                Contraseña
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaLock className="text-gray-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  required
                  className="w-full bg-neutral-800 border border-neutral-700 rounded-md py-3 pl-10 pr-10 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Contraseña"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-white"
                  disabled={isLoading}
                >
                  {showPassword ? 'Ocultar' : 'Mostrar'}
                </button>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-green-500 focus:ring-green-500 border-gray-600 rounded bg-gray-700"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-300">
                  Recuérdame
                </label>
              </div>
              
              <div className="text-sm">
                <a href="/reset-password" className="font-medium text-green-500 hover:text-green-400">
                  ¿Olvidaste tu contraseña?
                </a>
              </div>
            </div>
            
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full bg-green-500 hover:bg-green-600 text-black font-bold py-3 px-6 rounded-full transition-all duration-200 flex items-center justify-center ${
                isLoading ? 'opacity-70 cursor-not-allowed' : ''
              }`}
            >
              {isLoading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-black"></div>
              ) : (
                'Iniciar sesión'
              )}
            </button>
          </form>
          
          <p className="text-center text-gray-400 text-sm mt-6">
            ¿No tienes una cuenta?{' '}
            <a href="/auth/signup" className="text-green-500 hover:underline font-medium">
              Regístrate en Spotify
            </a>
          </p>
        </div>
      </div>
      
      <div className="mt-8 text-center text-xs text-neutral-400 max-w-md">
        <p>Este sitio está protegido por reCAPTCHA y se aplican la{' '}
          <a href="#" className="underline hover:text-white">Política de privacidad</a> y los{' '}
          <a href="#" className="underline hover:text-white">Términos de servicio</a> de Google.
        </p>
      </div>
    </main>
  );
}
