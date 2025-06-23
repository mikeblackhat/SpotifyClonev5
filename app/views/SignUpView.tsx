'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { FaSpotify, FaGoogle, FaFacebook, FaApple, FaEnvelope, FaLock, FaEye, FaEyeSlash, FaCheckCircle } from 'react-icons/fa';
import Link from 'next/link';
import { Modal } from '@/components/shared/ui/Modal';
import { useAuth } from '@/hooks/auth/useAuth';
import { validateSignUpForm, generateUsernameFromEmail, SignUpFormData } from '@/utils/validations/authValidations';

// Los tipos ahora se importan desde authValidations

export default function SignUpView() {
  const router = useRouter();
  const [formData, setFormData] = useState<SignUpFormData>({
    email: '',
    password: '',
    displayName: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  
  const {
    isLoading,
    isSocialLoading,
    error,
    handleRegister,
    handleSocialSignIn,
    setError
  } = useAuth({
    onSuccess: () => {
      // Redirigir directamente a la página principal
      router.push('/');
    },
    onRegisterSuccess: () => {
      // Redirigir al inicio de sesión si es necesario
      router.push('/auth/signin');
    },
    onError: (errorMsg) => {
      setError(errorMsg);
    }
  });

  const { email, password, displayName } = formData;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Efecto para manejar la transición de carga
  useEffect(() => {
    if (isLoading) {
      setIsTransitioning(true);
      const timer = setTimeout(() => {
        setIsTransitioning(false);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [isLoading]);

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validar el formulario
    const { isValid, errors } = validateSignUpForm({
      email,
      password,
      displayName
    });

    setFormErrors(errors);
    
    if (!isValid) {
      // Mostrar el primer error encontrado
      const firstError = Object.values(errors)[0];
      if (firstError) {
        setError(firstError);
      }
      return;
    }

    // Generar nombre de usuario y limpiar errores previos
    const username = generateUsernameFromEmail(email);
    setFormErrors({});
    
    // Llamar al manejador de registro
    const result = await handleRegister({
      email: email.trim(),
      password,
      username,
      name: displayName.trim()
    });
    
    // Si hay un error en el registro, mostrarlo
    if (result?.error) {
      setError(result.error);
    }
  };

  const handleSocialLogin = (provider: string) => {
    handleSocialSignIn(provider);
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
                  name="displayName"
                  value={displayName}
                  onChange={handleChange}
                  className={`w-full p-3 rounded-md bg-gray-900 border ${
                    formErrors.displayName ? 'border-red-500' : 'border-gray-700'
                  } text-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent`}
                  placeholder="¿Cómo quieres que te llamemos?"
                  required
                />
                {formErrors.displayName && (
                  <p className="mt-1 text-sm text-red-500">{formErrors.displayName}</p>
                )}
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
                  name="email"
                  value={email}
                  onChange={handleChange}
                  className={`w-full pl-10 pr-4 py-3 rounded-md bg-gray-900 border ${
                    formErrors.email ? 'border-red-500' : 'border-gray-700'
                  } text-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent`}
                  placeholder="Correo electrónico"
                  required
                />
                {formErrors.email && (
                  <p className="mt-1 text-sm text-red-500">{formErrors.email}</p>
                )}
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
                <div className="w-full">
                  <div className="flex">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      id="password"
                      name="password"
                      value={password}
                      onChange={handleChange}
                      className={`w-full pl-10 pr-12 py-3 rounded-md bg-gray-900 border ${
                        formErrors.password ? 'border-red-500' : 'border-gray-700'
                      } text-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent`}
                      placeholder="Contraseña"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-white focus:outline-none"
                    >
                      {showPassword ? <FaEyeSlash /> : <FaEye />}
                    </button>
                  </div>
                  {formErrors.password && (
                    <p className="mt-1 text-sm text-red-500">{formErrors.password}</p>
                  )}
                </div>
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
