'use client';

import { useState, useEffect, useRef } from 'react';
import { FiBell, FiCheck, FiX } from 'react-icons/fi';
import { useSession } from 'next-auth/react';

interface Notification {
  id: string;
  title: string;
  message: string;
  read: boolean;
  date: Date;
  type: 'info' | 'success' | 'warning' | 'error';
}

const Notifications = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { data: session } = useSession();

  // Cerrar el menú al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Cargar notificaciones de ejemplo (en una aplicación real, esto vendría de una API)
  useEffect(() => {
    if (!session) return;
    
    // Datos de ejemplo
    const exampleNotifications: Notification[] = [
      {
        id: '1',
        title: 'Bienvenido a Spotify',
        message: '¡Gracias por unirte a Spotify! Disfruta de tu música favorita.',
        read: false,
        date: new Date(),
        type: 'info'
      },
      {
        id: '2',
        title: 'Nueva canción',
        message: 'Tu artista favorito ha lanzado una nueva canción. ¡Escúchala ahora!',
        read: false,
        date: new Date(Date.now() - 3600000), // Hace 1 hora
        type: 'success'
      },
      {
        id: '3',
        title: 'Suscripción Premium',
        message: 'Tu suscripción Premium se renovará el próximo mes.',
        read: true,
        date: new Date(Date.now() - 86400000), // Hace 1 día
        type: 'warning'
      }
    ];

    setNotifications(exampleNotifications);
  }, [session]);

  const markAsRead = (id: string) => {
    setNotifications(notifications.map(notification => 
      notification.id === id ? { ...notification, read: true } : notification
    ));
  };

  const deleteNotification = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setNotifications(notifications.filter(notification => notification.id !== id));
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(notification => ({
      ...notification,
      read: true
    })));
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  if (!session) return null;

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-gray-400 hover:text-white rounded-full hover:bg-neutral-800 transition-colors"
        aria-label="Notificaciones"
      >
        <FiBell size={20} />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-green-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-neutral-900 border border-neutral-700 rounded-lg shadow-lg z-50 overflow-hidden">
          <div className="p-3 border-b border-neutral-700 flex justify-between items-center">
            <h3 className="font-bold text-white">Notificaciones</h3>
            {unreadCount > 0 && (
              <button 
                onClick={markAllAsRead}
                className="text-xs text-green-500 hover:underline"
              >
                Marcar todas como leídas
              </button>
            )}
          </div>
          
          <div className="max-h-96 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-4 text-center text-gray-400 text-sm">
                No hay notificaciones nuevas
              </div>
            ) : (
              notifications.map((notification) => (
                <div 
                  key={notification.id}
                  className={`p-3 border-b border-neutral-800 hover:bg-neutral-800 cursor-pointer transition-colors ${
                    !notification.read ? 'bg-neutral-800/50' : ''
                  }`}
                  onClick={() => markAsRead(notification.id)}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h4 className="font-medium text-white">{notification.title}</h4>
                      <p className="text-sm text-gray-400">{notification.message}</p>
                      <span className="text-xs text-gray-500 mt-1 block">
                        {formatDate(notification.date)}
                      </span>
                    </div>
                    <button 
                      onClick={(e) => deleteNotification(notification.id, e)}
                      className="text-gray-500 hover:text-white p-1 -mr-1"
                      aria-label="Eliminar notificación"
                    >
                      <FiX size={16} />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
          
          {notifications.length > 0 && (
            <div className="p-2 text-center border-t border-neutral-700">
              <button 
                onClick={() => setNotifications([])}
                className="text-xs text-gray-400 hover:text-white hover:underline"
              >
                Limpiar todas las notificaciones
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// Función auxiliar para formatear fechas
function formatDate(date: Date): string {
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  
  if (diffInSeconds < 60) return 'Hace unos segundos';
  if (diffInSeconds < 3600) return `Hace ${Math.floor(diffInSeconds / 60)} min`;
  if (diffInSeconds < 86400) return `Hace ${Math.floor(diffInSeconds / 3600)} h`;
  
  return date.toLocaleDateString('es-ES', { 
    day: '2-digit', 
    month: 'short',
    year: 'numeric'
  });
}

export default Notifications;
