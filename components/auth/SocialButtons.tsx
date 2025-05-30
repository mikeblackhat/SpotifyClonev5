'use client';

import { signIn } from 'next-auth/react';
import { FcGoogle } from 'react-icons/fc';
import { FaFacebook, FaApple, FaSpotify } from 'react-icons/fa';

interface SocialButtonsProps {
  isLoading: boolean;
  onError: (message: string) => void;
  buttonClassName?: string;
}

export function SocialButtons({ isLoading, onError, buttonClassName = '' }: SocialButtonsProps) {
  const handleSocialLogin = async (provider: string) => {
    try {
      onError('');
      
      const result = await signIn(provider, { 
        redirect: false,
        callbackUrl: '/',
      });
      
      if (result?.error) {
        onError(`Error al iniciar sesión con ${provider}. Intenta de nuevo.`);
      }
    } catch (error) {
      console.error(`Error al iniciar sesión con ${provider}:`, error);
      onError(`Error al iniciar sesión con ${provider}. Intenta de nuevo.`);
    }
  };

  const socialButtons = [
    { 
      provider: 'google', 
      icon: <FcGoogle className="text-xl" />, 
      text: 'Continuar con Google',
      color: 'bg-white hover:bg-neutral-200 text-black',
    },
    { 
      provider: 'facebook', 
      icon: <FaFacebook className="text-blue-600 text-xl" />, 
      text: 'Continuar con Facebook',
      color: 'bg-[#1877F2] hover:bg-[#166FE5] text-white',
    },
    { 
      provider: 'apple', 
      icon: <FaApple className="text-xl" />, 
      text: 'Continuar con Apple',
      color: 'bg-black hover:bg-neutral-800 text-white',
    },
    { 
      provider: 'spotify', 
      icon: <FaSpotify className="text-green-500 text-xl" />, 
      text: 'Continuar con Spotify',
      color: 'bg-black hover:bg-neutral-800 text-white border border-green-500',
    },
  ];

  return (
    <div className="space-y-4 w-full">
      {socialButtons.map(({ provider, icon, text, color }) => (
        <button
          key={provider}
          onClick={() => handleSocialLogin(provider)}
          disabled={isLoading}
          className={`w-full font-bold py-3 px-6 rounded-full flex items-center justify-center gap-3 transition-all duration-200 ${
            isLoading ? 'opacity-70 cursor-not-allowed' : ''
          } ${color} ${buttonClassName}`}
        >
          {isLoading ? (
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
  );
}
