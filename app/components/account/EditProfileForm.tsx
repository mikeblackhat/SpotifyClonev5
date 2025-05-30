'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { FaArrowLeft, FaUser, FaEnvelope, FaCalendarAlt, FaVenusMars, FaGlobe, FaCheckCircle } from 'react-icons/fa';
import { toast } from 'react-hot-toast';
import { Modal } from '@/components/ui/Modal';

interface UserProfile {
  _id: string;
  name?: string;
  username?: string;
  email: string;
  birthDate?: string;
  gender?: string;
  country?: string;
  bio?: string;
}

export default function EditProfileForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [profile, setProfile] = useState<Partial<UserProfile>>({
    name: '',
    username: '',
    email: '',
    birthDate: '',
    gender: 'prefiero-no-decir',
    country: 'MX',
    bio: '',
  });

  // Cargar datos del perfil al montar el componente
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('/api/profile');
        if (!response.ok) {
          throw new Error('Error al cargar el perfil');
        }
        const data = await response.json();
        
        console.log('Datos del perfil recibidos:', data); // Debug
        
        // Mapear los campos correctamente
        const formattedData: Partial<UserProfile> = {
          _id: data._id,
          name: data.name || '',
          username: data.username || '',
          email: data.email || '',
          gender: data.gender || 'prefiero-no-decir',
          country: data.country || 'MX',
          bio: data.bio || ''
        };
        
        // Formatear la fecha para el input de fecha
        if (data.birthDate) {
          const date = new Date(data.birthDate);
          formattedData.birthDate = date.toISOString().split('T')[0];
        } else {
          formattedData.birthDate = '';
        }
        
        setProfile(formattedData);
      } catch (error) {
        console.error('Error al cargar el perfil:', error);
        toast.error('No se pudo cargar el perfil');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setProfile(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    // Validar el nombre de usuario
    if (!profile.username || profile.username.trim().length < 3) {
      toast.error('El nombre de usuario debe tener al menos 3 caracteres');
      return;
    }
    
    // Validar formato del nombre de usuario (solo letras, números y guiones bajos)
    const usernameRegex = /^[a-zA-Z0-9_]+$/;
    if (!usernameRegex.test(profile.username)) {
      toast.error('El nombre de usuario solo puede contener letras, números y guiones bajos (_)');
      return;
    }
    
    try {
      setIsSaving(true);
      
      const response = await fetch('/api/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: profile.name || '',
          username: profile.username.trim(),
          birthDate: profile.birthDate || '',
          gender: profile.gender || 'prefiero-no-decir',
          country: profile.country || 'MX',
          bio: profile.bio || ''
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al guardar los cambios');
      }

      const updatedProfile = await response.json();
      
      // Actualizar el estado con los datos actualizados
      setProfile(prev => ({
        ...prev,
        name: updatedProfile.name || '',
        email: updatedProfile.email || '',
        gender: updatedProfile.gender || 'prefiero-no-decir',
        country: updatedProfile.country || 'MX',
        bio: updatedProfile.bio || '',
        birthDate: updatedProfile.birthDate ? 
          new Date(updatedProfile.birthDate).toISOString().split('T')[0] : ''
      }));
      
      // Mostrar el modal de éxito
      setIsSuccessModalOpen(true);
      
      // Redirigir después de 3 segundos
      setTimeout(() => {
        setIsSuccessModalOpen(false);
        router.push('/account');
      }, 3000);
      
    } catch (error) {
      console.error('Error al guardar el perfil:', error);
      toast.error(error instanceof Error ? error.message : 'Error al guardar el perfil');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500 mb-4"></div>
          <p className="text-gray-400">Cargando perfil...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="mb-4">
        <button 
          onClick={() => router.back()}
          className="flex items-center text-gray-400 hover:text-white transition-colors text-sm"
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Volver
        </button>
      </div>


      
      <form onSubmit={handleSubmit} className="w-full relative">
        {isSaving && (
          <div className="absolute inset-0 bg-black/50 rounded-2xl flex items-center justify-center z-10">
            <div className="flex flex-col items-center">
              <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-green-500 mb-2"></div>
              <p className="text-gray-300 text-sm">Guardando cambios...</p>
            </div>
          </div>
        )}
        <div className="flex flex-col lg:flex-row gap-6 bg-gray-900/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-800/50 shadow-xl">
          {/* Columna izquierda - Foto de perfil */}
          <div className="w-full lg:w-1/3 flex-shrink-0 flex flex-col items-center px-6 py-8">
            <div className="relative group mb-5 w-full flex justify-center">
              <div className="w-40 h-40 lg:w-48 lg:h-48 rounded-full bg-gradient-to-br from-gray-700 to-gray-800 flex items-center justify-center overflow-hidden shadow-2xl border-2 border-gray-700 transition-all duration-300 group-hover:border-green-500/50">
                <FaUser className="text-6xl lg:text-7xl text-gray-400" />
              </div>
              <button 
                type="button"
                className="absolute -bottom-2 -right-2 bg-green-500 text-white p-2 lg:px-3 lg:py-2 rounded-full hover:bg-green-600 transition-all duration-200 transform hover:scale-105 shadow-xl"
              >
                <span className="text-sm font-medium">Cambiar</span>
              </button>
            </div>
            <button 
              type="button"
              className="text-sm text-gray-400 hover:text-green-400 transition-colors duration-200 flex items-center group mt-2"
            >
              <span className="group-hover:underline">Eliminar foto</span>
              <span className="ml-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200">→</span>
            </button>
          </div>

          {/* Columna derecha - Campos del formulario */}
          <div className="flex-1">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {/* Nombre para mostrar */}
              <div className="space-y-1.5">
                <label htmlFor="name" className="text-xs font-semibold text-gray-400 uppercase tracking-wider flex items-center">
                  <FaUser className="mr-2 text-green-400" /> 
                  <span>Nombre para mostrar</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={profile.name || ''}
                    onChange={handleChange}
                    className="w-full text-sm bg-gray-800/80 border border-gray-700 rounded-lg px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-transparent transition-all duration-200"
                    placeholder="Tu nombre"
                    maxLength={50}
                  />
                </div>
              </div>

              {/* Nombre de usuario */}
              <div className="space-y-1.5">
                <label htmlFor="username" className="text-xs font-semibold text-gray-400 uppercase tracking-wider flex items-center">
                  <FaUser className="mr-2 text-green-400" /> 
                  <span>Nombre de usuario</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    id="username"
                    name="username"
                    value={profile.username || ''}
                    onChange={handleChange}
                    className="w-full text-sm bg-gray-800/80 border border-gray-700 rounded-lg px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-transparent transition-all duration-200"
                    placeholder="Tu nombre de usuario"
                    minLength={3}
                    maxLength={30}
                    pattern="[a-zA-Z0-9_]+$"
                    title="Solo letras, números y guiones bajos (_)"
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">Este es tu identificador único en la plataforma</p>
              </div>

              {/* Correo electrónico */}
              <div className="space-y-1.5">
                <label htmlFor="email" className="text-xs font-semibold text-gray-400 uppercase tracking-wider flex items-center">
                  <FaEnvelope className="mr-2 text-green-400" /> 
                  <span>Correo electrónico</span>
                </label>
                <div className="relative">
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={profile.email}
                    onChange={handleChange}
                    className="w-full text-sm bg-gray-800/50 border border-gray-700/50 rounded-lg px-4 py-2.5 text-gray-400 cursor-not-allowed focus:outline-none"
                    placeholder="tu@email.com"
                    disabled
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <span className="text-xs text-gray-600">Solo lectura</span>
                  </div>
                </div>
              </div>

              {/* Fecha de nacimiento */}
              <div className="space-y-1.5">
                <label htmlFor="birthDate" className="text-xs font-semibold text-gray-400 uppercase tracking-wider flex items-center">
                  <FaCalendarAlt className="mr-2 text-green-400" /> 
                  <span>Fecha de nacimiento</span>
                </label>
                <div className="relative">
                  <input
                    type="date"
                    id="birthDate"
                    name="birthDate"
                    value={profile.birthDate}
                    onChange={handleChange}
                    className="w-full text-sm bg-gray-800/80 border border-gray-700 rounded-lg px-4 py-2.5 text-white appearance-none focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-transparent transition-all duration-200"
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Género */}
              <div className="space-y-1.5">
                <label htmlFor="gender" className="text-xs font-semibold text-gray-400 uppercase tracking-wider flex items-center">
                  <FaVenusMars className="mr-2 text-green-400" /> 
                  <span>Género</span>
                </label>
                <div className="relative">
                  <select
                    id="gender"
                    name="gender"
                    value={profile.gender}
                    onChange={handleChange}
                    className="w-full text-sm bg-gray-800/80 border border-gray-700 rounded-lg px-4 py-2.5 text-white appearance-none focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-transparent transition-all duration-200 cursor-pointer"
                  >
                    <option value="mujer">Mujer</option>
                    <option value="hombre">Hombre</option>
                    <option value="no-binario">No binario</option>
                    <option value="otro">Otro</option>
                    <option value="prefiero-no-decir">Prefiero no decirlo</option>
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* País/Región */}
              <div className="space-y-1.5">
                <label htmlFor="country" className="text-xs font-semibold text-gray-400 uppercase tracking-wider flex items-center">
                  <FaGlobe className="mr-2 text-green-400" /> 
                  <span>País/Región</span>
                </label>
                <div className="relative">
                  <select
                    id="country"
                    name="country"
                    value={profile.country}
                    onChange={handleChange}
                    className="w-full text-sm bg-gray-800/80 border border-gray-700 rounded-lg px-4 py-2.5 text-white appearance-none focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-transparent transition-all duration-200 cursor-pointer"
                  >
                    <option value="MX">México</option>
                    <option value="ES">España</option>
                    <option value="AR">Argentina</option>
                    <option value="CO">Colombia</option>
                    <option value="US">Estados Unidos</option>
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Biografía */}
              <div className="md:col-span-2 space-y-1.5 flex-1 flex flex-col">
                <div className="flex-1 flex flex-col">
                <label htmlFor="bio" className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  Biografía
                </label>
                <div className="relative">
                  <textarea
                    id="bio"
                    name="bio"
                    value={profile.bio}
                    onChange={handleChange}
                    className="w-full h-full text-sm bg-gray-800/80 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-transparent transition-all duration-200 resize-none min-h-[120px]"
                    style={{ minHeight: '120px' }}
                    placeholder="Cuéntanos sobre ti..."
                    maxLength={150}
                  />
                </div>
                <div className="mt-2">
                  <div className="bg-gray-900/80 px-3 py-1.5 rounded-lg text-xs text-gray-400 inline-flex items-center">
                    <span className="text-green-400 font-medium mr-1">{profile.bio?.length || 0}</span>
                    <span>/ 150 caracteres</span>
                  </div>
                </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Botones de acción */}
        <div className="flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-4 pt-2">
          <button
            type="button"
            onClick={() => router.back()}
            className="px-6 py-2.5 text-sm font-medium rounded-lg border border-gray-700 text-gray-300 hover:bg-gray-800/50 hover:text-white transition-all duration-200 transform hover:-translate-y-0.5 hover:shadow-lg"
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="px-6 py-2.5 text-sm font-medium rounded-lg bg-gradient-to-r from-green-500 to-emerald-500 text-black hover:from-green-400 hover:to-emerald-400 transition-all duration-200 transform hover:-translate-y-0.5 hover:shadow-lg hover:shadow-green-500/20"
          >
            Guardar cambios
          </button>
        </div>
      </form>

      {/* Modal de éxito */}
      <Modal 
        isOpen={isSuccessModalOpen} 
        onClose={() => {
          setIsSuccessModalOpen(false);
          router.push('/account');
        }}
        closeOnClickOutside={false}
      >
        <div className="text-center p-6">
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-4">
            <FaCheckCircle className="h-10 w-10 text-green-600" />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">¡Perfil actualizado!</h3>
          <p className="text-gray-300 mb-6">Tus cambios se han guardado correctamente.</p>
          <div className="mt-6">
            <div className="flex justify-center">
              <button
                type="button"
                onClick={() => {
                  setIsSuccessModalOpen(false);
                  router.push('/account');
                }}
                className="px-6 py-2.5 bg-green-600 text-white font-medium rounded-full hover:bg-green-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              >
                ¡Entendido!
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-3">Redirigiendo en 3 segundos...</p>
          </div>
        </div>
      </Modal>
    </div>
  );
}
