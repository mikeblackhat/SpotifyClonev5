'use client';

import { useState } from 'react';
import { FaSpotify, FaGoogle, FaFacebook, FaApple } from 'react-icons/fa';
import Link from 'next/link';
import { useAuth } from '@/hooks/auth/useAuth';

export default function SignInView() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const {
    isLoading,
    isSocialLoading,
    error,
    handleSignIn,
    handleSocialSignIn,
    setError
  } = useAuth({
    onSuccess: () => {
      // Redirigir al dashboard o página principal después del inicio de sesión exitoso
      window.location.href = '/';
    }
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await handleSignIn(email, password);
  };

  const handleSocialLogin = (provider: string) => {
    handleSocialSignIn(provider);
  };

  const socialButtons = [
    { 
      provider: 'spotify', 
      icon: <FaSpotify className="text-xl" />, 
      text: 'Continuar con Spotify',
      color: 'bg-[#1DB954] hover:bg-[#1ed760] text-black',
    },
    { 
      provider: 'google', 
      icon: <FaGoogle className="text-xl" />, 
      text: 'Continuar con Google',
      color: 'bg-white hover:bg-gray-100 text-black',
    },
    { 
      provider: 'facebook', 
      icon: <FaFacebook className="text-xl text-[#1877F2]" />, 
      text: 'Continuar con Facebook',
      color: 'bg-[#1877F2] hover:bg-[#0d6efd] text-white',
    },
    { 
      provider: 'apple', 
      icon: <FaApple className="text-xl" />, 
      text: 'Continuar con Apple',
      color: 'bg-black hover:bg-neutral-800 text-white',
    }
  ];

  return (
    <main className="flex-1 flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full bg-black/50 backdrop-blur-md rounded-lg p-8 border border-neutral-800">
        <h1 className="text-3xl font-bold text-center mb-8">Inicia sesión en Spotify</h1>
        
        <div className="space-y-4">
          {/* Botones de redes sociales */}
          <div className="space-y-4">
            {socialButtons.map(({ provider, icon, text, color }) => (
              <button
                key={provider}
                onClick={() => handleSocialLogin(provider)}
                disabled={!!isSocialLoading}
                className={`w-full font-bold py-3 px-6 rounded-full flex items-center justify-center gap-3 transition-all duration-200 ${
                  isSocialLoading ? 'opacity-70 cursor-not-allowed' : ''
                } ${color} ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
              >
                {isSocialLoading === provider ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-current"></div>
                ) : (
                  <>
                    {icon}
                    {text}
                  </>
                )}
              </button>
            ))}
          </div>

          <div className="relative flex items-center my-6">
            <div className="flex-1 border-t border-neutral-700"></div>
            <span className="px-4 text-neutral-400 text-sm">o</span>
            <div className="flex-1 border-t border-neutral-700"></div>
          </div>

          {/* Formulario de inicio de sesión */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="bg-red-900/50 border border-red-700 text-red-200 px-4 py-3 rounded mb-4 text-sm">
                {error}
              </div>
            )}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-neutral-300 mb-1">
                Correo electrónico o nombre de usuario
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-neutral-900 border border-neutral-700 rounded px-4 py-3 text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="Correo electrónico o nombre de usuario"
                disabled={isLoading}
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-neutral-300 mb-1">
                Contraseña
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-neutral-900 border border-neutral-700 rounded px-4 py-3 text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="Contraseña"
                disabled={isLoading}
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="remember"
                  className="h-4 w-4 text-green-500 rounded border-neutral-600 bg-neutral-800 focus:ring-green-500"
                />
                <label htmlFor="remember" className="ml-2 text-sm text-neutral-300">
                  Recordarme
                </label>
              </div>
              <Link href="/auth/forgot-password" className="text-sm text-green-500 hover:underline">
                ¿Olvidaste tu contraseña?
              </Link>
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-green-500 hover:bg-green-600 text-black font-bold py-3 px-4 rounded-full transition-colors duration-200 flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-black"></div>
                  Iniciando sesión...
                </>
              ) : (
                'Iniciar sesión'
              )}
            </button>
          </form>

          <div className="text-center mt-6">
            <p className="text-neutral-400">
              ¿No tienes una cuenta?{' '}
              <Link href="/auth/signup" className="text-white hover:text-green-500 hover:underline">
                Regístrate en Spotify
              </Link>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
