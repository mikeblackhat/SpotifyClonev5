'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FaLock, FaArrowLeft } from 'react-icons/fa';
import { toast } from 'react-hot-toast';

export default function ChangePasswordForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validaciones
    if (formData.newPassword !== formData.confirmPassword) {
      toast.error('Las contraseñas no coinciden');
      return;
    }
    
    if (formData.newPassword.length < 8) {
      toast.error('La nueva contraseña debe tener al menos 8 caracteres');
      return;
    }
    
    try {
      setIsLoading(true);
      
      const response = await fetch('/api/auth/change-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          currentPassword: formData.currentPassword,
          newPassword: formData.newPassword
        }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Error al cambiar la contraseña');
      }
      
      toast.success('Contraseña actualizada correctamente');
      setFormData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      
      // Redirigir después de 1.5 segundos
      setTimeout(() => {
        router.push('/account');
      }, 1500);
      
    } catch (error) {
      console.error('Error al cambiar la contraseña:', error);
      toast.error(error instanceof Error ? error.message : 'Error al cambiar la contraseña');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-gradient-to-b from-gray-900 to-black rounded-xl shadow-2xl">
      <div className="mb-8">
        <button 
          onClick={() => router.back()}
          className="flex items-center text-gray-400 hover:text-white transition-colors mb-6"
        >
          <FaArrowLeft className="mr-2" />
          Volver
        </button>
        
        <div className="flex items-center mb-6">
          <div className="p-3 bg-green-900/30 rounded-full mr-4">
            <FaLock className="text-green-400 text-xl" />
          </div>
          <h1 className="text-2xl font-bold text-white">Cambiar contraseña</h1>
        </div>
        
        <p className="text-gray-400 text-sm">
          Ingresa tu contraseña actual y la nueva contraseña que deseas establecer.
        </p>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="currentPassword" className="text-sm font-medium text-gray-400 block">
              Contraseña actual
            </label>
            <input
              type="password"
              id="currentPassword"
              name="currentPassword"
              value={formData.currentPassword}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
              placeholder="••••••••"
              required
            />
          </div>
          
          <div className="space-y-2">
            <label htmlFor="newPassword" className="text-sm font-medium text-gray-400 block">
              Nueva contraseña
            </label>
            <input
              type="password"
              id="newPassword"
              name="newPassword"
              value={formData.newPassword}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
              placeholder="••••••••"
              minLength={8}
              required
            />
            <p className="text-xs text-gray-500 mt-1">
              Mínimo 8 caracteres
            </p>
          </div>
          
          <div className="space-y-2">
            <label htmlFor="confirmPassword" className="text-sm font-medium text-gray-400 block">
              Confirmar nueva contraseña
            </label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
              placeholder="••••••••"
              minLength={8}
              required
            />
          </div>
        </div>
        
        <div className="pt-2">
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full py-3 px-6 bg-green-600 hover:bg-green-700 text-white font-medium rounded-full transition-all duration-200 flex items-center justify-center ${
              isLoading ? 'opacity-70 cursor-not-allowed' : ''
            }`}
          >
            {isLoading ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Actualizando...
              </>
            ) : 'Cambiar contraseña'}
          </button>
        </div>
      </form>
    </div>
  );
}
