'use client';

import { signIn } from 'next-auth/react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FaSpotify, FaGoogle, FaFacebook, FaApple, FaEnvelope, FaLock, FaEye, FaEyeSlash } from 'react-icons/fa';
import Link from 'next/link';

export default function SignUpView() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isSocialLoading, setIsSocialLoading] = useState<string | null>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validaciones básicas
    if (!email || !password || !displayName) {
      setError('Por favor completa todos los campos');
      return;
    }

    // Validar formato de correo electrónico
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Por favor ingresa un correo electrónico válido');
      return;
    }

    // Validar contraseña (mínimo 8 caracteres, al menos una letra y un número)
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
    if (!passwordRegex.test(password)) {
      setError('La contraseña debe tener al menos 8 caracteres, incluyendo una letra y un número');
      return;
    }

    // Validar nombre de usuario
    if (displayName.trim().length < 3) {
      setError('El nombre debe tener al menos 3 caracteres');
      return;
    }

    // Generar un nombre de usuario a partir del correo electrónico
    const username = email.split('@')[0].toLowerCase().replace(/[^a-z0-9]/g, '');
    
    setIsLoading(true);
    setError(null);

    try {
      // 1. Registrar al usuario en la base de datos
      const registerResponse = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email.trim(),
          password: password,
          username: username,
          name: displayName.trim()
        }),
      });

      const registerData = await registerResponse.json();

      if (!registerResponse.ok) {
        throw new Error(registerData.message || 'Error al registrar el usuario');
      }
      
      // 2. Iniciar sesión automáticamente después del registro exitoso
      const signInResult = await signIn('credentials', {
        redirect: false,
        email: email.trim(),
        password: password,
      });

      if (signInResult?.error) {
        // Si hay un error al iniciar sesión, redirigir a la página de inicio de sesión
        // con un mensaje de éxito en el registro
        router.push('/auth/signin?registered=true');
        return;
      }
      
      // 3. Redirigir a la página de inicio después de iniciar sesión exitosamente
      if (signInResult?.url) {
        router.push(signInResult.url);
      } else {
        // Si no hay URL de redirección, redirigir a la página de inicio
        router.push('/');
      }
      
    } catch (error: any) {
      console.error('Error en el registro:', error);
      
      // Manejar diferentes tipos de errores
      if (error.message.includes('E11000')) {
        if (error.message.includes('email')) {
          setError('Ya existe una cuenta con este correo electrónico');
        } else if (error.message.includes('username')) {
          setError('El nombre de usuario ya está en uso');
        } else {
          setError('El usuario ya existe');
        }
      } else {
        setError(error.message || 'Ocurrió un error al registrarte. Por favor, inténtalo de nuevo.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialLogin = async (provider: string) => {
    setIsSocialLoading(provider);
    try {
      await signIn(provider, { callbackUrl: '/' });
    } catch (error) {
      console.error('Error al iniciar sesión con ' + provider, error);
      setError(`Error al iniciar sesión con ${provider}`);
      setIsSocialLoading(null);
    }
  };

  const socialButtons = [
    { 
      provider: 'spotify', 
      icon: <FaSpotify className="text-xl" />, 
      text: 'Regístrate con Spotify',
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

  // Efecto de carga suave

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsTransitioning(true);
    try {
      await handleSubmit(e);
    } catch (err) {
      console.error('Error en el formulario:', err);
      setIsTransitioning(false);
    }
  };

  return (
    <main className="flex-1 flex flex-col items-center justify-center p-4">
      <div className={`max-w-md w-full bg-black/50 backdrop-blur-md rounded-lg p-8 border border-neutral-800 transition-opacity duration-300 ${
        isTransitioning ? 'opacity-75' : 'opacity-100'
      }`}>
        <h1 className="text-3xl font-bold text-center mb-8">
          {isTransitioning ? 'Procesando...' : 'Regístrate en Spotify'}
        </h1>
        
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

          {/* Formulario de registro */}
          <form onSubmit={handleFormSubmit} className="space-y-4">
            {error && (
              <div className="bg-red-900/50 border border-red-700 text-red-200 px-4 py-3 rounded mb-4 text-sm">
                {error}
              </div>
            )}
            
            <div>
              <label htmlFor="displayName" className="block text-sm font-medium text-neutral-300 mb-1">
                ¿Cómo quieres que te llamemos?
              </label>
              <div className="relative">
                <input
                  type="text"
                  id="displayName"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className="w-full bg-neutral-900 border border-neutral-700 rounded px-4 py-3 text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Introduce un nombre de perfil"
                  disabled={isLoading}
                />
              </div>
              <p className="mt-1 text-xs text-neutral-400">
                Esto aparece en tu perfil.
              </p>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-neutral-300 mb-1">
                Correo electrónico
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaEnvelope className="text-gray-400" />
                </div>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-neutral-900 border border-neutral-700 rounded pl-10 pr-4 py-3 text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Introduce tu correo electrónico"
                  disabled={isLoading}
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-neutral-300 mb-1">
                Crea una contraseña
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaLock className="text-gray-400" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-neutral-900 border border-neutral-700 rounded pl-10 pr-10 py-3 text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Crea una contraseña"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-white"
                  disabled={isLoading}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
              <p className="mt-1 text-xs text-neutral-400">
                Usa 8 caracteres como mínimo con una letra y un número.
              </p>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="terms"
                className="h-4 w-4 text-green-500 rounded border-neutral-600 bg-neutral-800 focus:ring-green-500"
                required
              />
              <label htmlFor="terms" className="ml-2 block text-sm text-neutral-300">
                Acepto los <a href="#" className="text-green-500 hover:underline">Términos y condiciones</a> de Spotify
              </label>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-green-500 hover:bg-green-600 text-black font-bold py-3 px-4 rounded-full transition-colors duration-200 flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-black"></div>
                  Creando cuenta...
                </>
              ) : (
                'Registrarte'
              )}
            </button>
          </form>

          <div className="text-center mt-6">
            <p className="text-neutral-400">
              ¿Ya tienes una cuenta?{' '}
              <Link href="/auth/signin" className="text-white hover:text-green-500 hover:underline">
                Inicia sesión en Spotify
              </Link>
            </p>
          </div>
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
