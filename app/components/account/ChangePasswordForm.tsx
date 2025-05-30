'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { FaLock, FaArrowLeft, FaCheckCircle, FaExclamationTriangle, FaEye, FaEyeSlash } from 'react-icons/fa';
import { toast } from 'react-hot-toast';
import { Modal } from '@/components/ui/Modal';

export default function ChangePasswordForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false
  });
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  
  // Resetear el error cuando los campos cambian
  useEffect(() => {
    setError(null);
  }, [formData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const toggleShowPassword = (field: 'current' | 'new' | 'confirm') => {
    setShowPassword(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  const getInputType = (field: 'current' | 'new' | 'confirm') => {
    return showPassword[field] ? 'text' : 'password';
  };

  const validateForm = () => {
    if (!formData.currentPassword) {
      setError('Por favor ingresa tu contraseña actual');
      return false;
    }
    
    if (formData.newPassword.length < 8) {
      setError('La nueva contraseña debe tener al menos 8 caracteres');
      return false;
    }
    
    if (formData.newPassword !== formData.confirmPassword) {
      setError('Las contraseñas no coinciden');
      return false;
    }
    
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    try {
      setIsLoading(true);
      setError(null);
      
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
      
      // Mostrar modal de éxito
      setShowSuccessModal(true);
      
      // Limpiar el formulario
      setFormData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      
    } catch (error) {
      console.error('Error al cambiar la contraseña:', error);
      const errorMessage = error instanceof Error ? error.message : 'Error al cambiar la contraseña';
      setError(errorMessage);
      toast.error(errorMessage, { duration: 5000 });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSuccessClose = () => {
    setShowSuccessModal(false);
    router.push('/account');
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-gradient-to-b from-gray-900 to-black rounded-xl shadow-2xl relative">
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
            <div className="relative">
              <input
                type={getInputType('current')}
                id="currentPassword"
                name="currentPassword"
                value={formData.currentPassword}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all pr-10"
                placeholder="••••••••"
                required
              />
              <button
                type="button"
                onClick={() => toggleShowPassword('current')}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white focus:outline-none"
                aria-label={showPassword.current ? 'Ocultar contraseña' : 'Mostrar contraseña'}
              >
                {showPassword.current ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>
          
          <div className="space-y-2">
            <label htmlFor="newPassword" className="text-sm font-medium text-gray-400 block">
              Nueva contraseña
            </label>
            <div className="relative">
              <input
                type={getInputType('new')}
                id="newPassword"
                name="newPassword"
                value={formData.newPassword}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all pr-10"
                placeholder="••••••••"
                minLength={8}
                required
              />
              <button
                type="button"
                onClick={() => toggleShowPassword('new')}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white focus:outline-none"
                aria-label={showPassword.new ? 'Ocultar contraseña' : 'Mostrar contraseña'}
              >
                {showPassword.new ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Mínimo 8 caracteres
            </p>
          </div>
          
          <div className="space-y-2">
            <label htmlFor="confirmPassword" className="text-sm font-medium text-gray-400 block">
              Confirmar nueva contraseña
            </label>
            <div className="relative">
              <input
                type={getInputType('confirm')}
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all pr-10"
                placeholder="••••••••"
                minLength={8}
                required
              />
              <button
                type="button"
                onClick={() => toggleShowPassword('confirm')}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white focus:outline-none"
                aria-label={showPassword.confirm ? 'Ocultar contraseña' : 'Mostrar contraseña'}
              >
                {showPassword.confirm ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
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
      
      {/* Modal de éxito */}
      <Modal 
        isOpen={showSuccessModal} 
        onClose={handleSuccessClose}
        closeOnClickOutside={false}
      >
        <div className="text-center p-6">
          <div className="flex justify-center mb-4">
            <div className="bg-green-100 p-3 rounded-full">
              <FaCheckCircle className="text-green-500 text-4xl" />
            </div>
          </div>
          <h3 className="text-xl font-bold text-white mb-2">¡Contraseña actualizada!</h3>
          <p className="text-gray-300 mb-6">Tu contraseña ha sido cambiada exitosamente.</p>
          <button
            onClick={handleSuccessClose}
            className="w-full py-2 px-4 bg-green-600 hover:bg-green-700 text-white font-medium rounded-full transition-colors"
          >
            Aceptar
          </button>
        </div>
      </Modal>
      
      {/* Mensaje de error */}
      {error && (
        <div className="mt-4 p-4 bg-red-900/30 border border-red-700 rounded-lg flex items-start">
          <FaExclamationTriangle className="text-red-400 mt-0.5 mr-3 flex-shrink-0" />
          <span className="text-red-200 text-sm">{error}</span>
        </div>
      )}
    </div>
  );
}
