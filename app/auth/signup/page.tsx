'use client';

import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { FcGoogle } from 'react-icons/fc';
import { FaFacebook, FaApple, FaEnvelope, FaLock, FaUser } from 'react-icons/fa';

export default function SignUpPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formError, setFormError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    
    // Validaciones básicas del lado del cliente
    if (formData.password !== formData.confirmPassword) {
      setFormError('Las contraseñas no coinciden');
      return;
    }
    
    if (formData.password.length < 6) {
      setFormError('La contraseña debe tener al menos 6 caracteres');
      return;
    }
    
    // Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setFormError('Por favor ingresa un correo electrónico válido');
      return;
    }
    
    try {
      setIsLoading(true);
      
      // Validar nombre de usuario
      if (!formData.username || formData.username.trim().length < 3) {
        setFormError('El nombre de usuario debe tener al menos 3 caracteres');
        return;
      }
      
      // Crear el objeto de usuario con los datos del formulario
      const userData = {
        username: formData.username.trim(),
        email: formData.email,
        password: formData.password
      };
      
      // Enviar la solicitud al endpoint de registro
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        // Manejar errores específicos del servidor
        if (data.field) {
          // Error de validación con campo específico
          setFormError(data.message);
        } else if (data.missingFields) {
          // Faltan campos requeridos
          const missingFields = Object.entries(data.missingFields)
            .filter(([_, isMissing]) => isMissing)
            .map(([field]) => field);
          
          setFormError(`Por favor completa los siguientes campos: ${missingFields.join(', ')}`);
        } else {
          // Otro tipo de error
          throw new Error(data.message || 'Error al registrar el usuario');
        }
        return;
      }
      
      // Registro exitoso, redirigir a la página de inicio de sesión
      setSuccess(true);
      setTimeout(() => {
        router.push('/auth/signin');
      }, 2000);
      
    } catch (error: any) {
      console.error('Error en el registro:', error);
      
      // Manejar diferentes tipos de errores
      if (error.name === 'TypeError' && error.message.includes('Failed to fetch')) {
        setFormError('No se pudo conectar con el servidor. Por favor, verifica tu conexión a Internet.');
      } else if (error.name === 'SyntaxError') {
        setFormError('Error en el formato de la respuesta del servidor.');
      } else {
        setFormError(error.message || 'Error al registrar el usuario. Por favor, intenta de nuevo.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-4 bg-black">
      <div className="max-w-md w-full bg-neutral-900/80 backdrop-blur-md rounded-lg p-8 border border-neutral-800">
        <h1 className="text-3xl font-bold text-center mb-8 text-white">Regístrate en Spotify</h1>
        
        <div className="space-y-4">
          {/* Botones de registro con redes sociales */}
          <button 
            onClick={() => signIn('google', { callbackUrl: '/' })}
            className="w-full bg-white text-black hover:bg-neutral-200 font-bold py-3 px-6 rounded-full flex items-center justify-center gap-3 transition-all duration-200"
          >
            <FcGoogle className="text-xl" />
            Registrarse con Google
          </button>
          
          <button 
            onClick={() => signIn('facebook', { callbackUrl: '/' })}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-full flex items-center justify-center gap-3 transition-all duration-200"
          >
            <FaFacebook className="text-xl" />
            Registrarse con Facebook
          </button>
          
          <button 
            onClick={() => signIn('apple', { callbackUrl: '/' })}
            className="w-full bg-black hover:bg-neutral-900 text-white font-bold py-3 px-6 rounded-full border border-neutral-700 flex items-center justify-center gap-3 transition-all duration-200"
          >
            <FaApple className="text-xl" />
            Registrarse con Apple
          </button>
          
          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-neutral-700"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-neutral-900/80 text-neutral-400">o</span>
            </div>
          </div>
          
          <button 
            onClick={() => signIn('spotify', { callbackUrl: '/' })}
            className="w-full bg-green-500 hover:bg-green-600 text-black font-bold py-3 px-6 rounded-full flex items-center justify-center gap-3 transition-all duration-200"
          >
            Registrarse con Spotify
          </button>
          
          {/* Formulario de registro */}
          <div className="pt-4">
            <form onSubmit={handleSubmit} className="space-y-4">
              {formError && (
                <div className="text-red-500 text-sm text-center p-2 bg-red-500/10 rounded-md">
                  {formError}
                </div>
              )}
              
              <div className="space-y-4">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaUser className="text-gray-400" />
                  </div>
                  <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    placeholder="Nombre de usuario"
                    className="w-full bg-neutral-800 text-white rounded-md py-3 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-green-500"
                    required
                    minLength={3}
                    disabled={isLoading}
                  />
                </div>
                
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaEnvelope className="text-gray-400" />
                  </div>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Correo electrónico"
                    className="w-full bg-neutral-800 text-white rounded-md py-3 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-green-500"
                    required
                    disabled={isLoading}
                  />
                </div>
                
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaLock className="text-gray-400" />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Contraseña"
                    className="w-full bg-neutral-800 text-white rounded-md py-3 pl-10 pr-10 focus:outline-none focus:ring-2 focus:ring-green-500"
                    required
                    disabled={isLoading}
                    minLength={6}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm text-gray-400"
                  >
                    {showPassword ? 'Ocultar' : 'Mostrar'}
                  </button>
                </div>
                
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaLock className="text-gray-400" />
                  </div>
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="Confirmar contraseña"
                    className="w-full bg-neutral-800 text-white rounded-md py-3 pl-10 pr-10 focus:outline-none focus:ring-2 focus:ring-green-500"
                    required
                    disabled={isLoading}
                    minLength={6}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm text-gray-400"
                  >
                    {showConfirmPassword ? 'Ocultar' : 'Mostrar'}
                  </button>
                </div>
                
                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className={`w-full font-bold py-3 px-6 rounded-full transition-all duration-200 flex items-center justify-center ${
                      isLoading 
                        ? 'bg-green-600 text-black/50 cursor-not-allowed' 
                        : 'bg-green-500 hover:bg-green-600 text-black'
                    }`}
                  >
                    {isLoading ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Registrando...
                      </>
                    ) : (
                      'Registrarse'
                    )}
                  </button>
                </div>
              </div>
            </form>
            
            <div className="text-center text-neutral-400 text-sm mt-6">
              ¿Ya tienes una cuenta?{' '}
              <button 
                onClick={() => router.push('/auth/signin')}
                className="text-white hover:underline font-medium"
              >
                Iniciar sesión
              </button>
            </div>
            
            <div className="text-center text-xs text-neutral-500 mt-6">
              <p>Este sitio está protegido por reCAPTCHA y se aplican la <a href="#" className="hover:underline">Política de privacidad</a> y los <a href="#" className="hover:underline">Términos de servicio</a> de Google.</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
