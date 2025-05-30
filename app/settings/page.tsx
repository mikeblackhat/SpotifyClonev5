'use client';

import { FiUser, FiLock, FiBell, FiVolume2, FiMusic, FiMonitor, FiSmartphone } from 'react-icons/fi';

const SettingsPage = () => {
  return (
    <div className="p-6 max-w-4xl mx-auto mb-32">
      <h1 className="text-3xl font-bold text-white mb-8">Configuración</h1>
      
      <div className="space-y-6">
        <SettingsSection title="Cuenta">
          <SettingItem 
            icon={<FiUser className="text-xl" />}
            title="Perfil"
            description="Edita tu perfil, contraseña e información personal"
            href="/profile"
          />
          <SettingItem 
            icon={<FiLock className="text-xl" />}
            title="Privacidad"
            description="Gestiona tu privacidad y configuración de datos"
            href="/settings/privacy"
          />
        </SettingsSection>

        <SettingsSection title="Notificaciones">
          <SettingItem 
            icon={<FiBell className="text-xl" />}
            title="Preferencias de notificaciones"
            description="Elige qué notificaciones quieres recibir"
            href="/settings/notifications"
          />
        </SettingsSection>

        <SettingsSection title="Reproducción">
          <SettingItem 
            icon={<FiVolume2 className="text-xl" />}
            title="Audio"
            description="Calidad de audio y normalización"
            href="/settings/audio"
          />
          <SettingItem 
            icon={<FiMusic className="text-xl" />}
            title="Reproducción"
            description="Crossfade, volumen inicial y más"
            href="/settings/playback"
          />
        </SettingsSection>

        <SettingsSection title="Dispositivos">
          <SettingItem 
            icon={<FiSmartphone className="text-xl" />}
            title="Aplicaciones móviles"
            description="Gestiona tus dispositivos móviles"
            href="/settings/devices"
          />
          <SettingItem 
            icon={<FiMonitor className="text-xl" />}
            title="Aplicación de escritorio"
            description="Configuración de la aplicación de escritorio"
            href="/settings/desktop"
          />
        </SettingsSection>
      </div>
    </div>
  );
};

const SettingsSection = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div className="bg-neutral-800 rounded-lg overflow-hidden">
    <h2 className="text-lg font-semibold text-white px-6 py-4 border-b border-neutral-700">
      {title}
    </h2>
    <div className="divide-y divide-neutral-700">
      {children}
    </div>
  </div>
);

type SettingItemProps = {
  icon: React.ReactNode;
  title: string;
  description: string;
  href: string;
};

const SettingItem = ({ icon, title, description, href }: SettingItemProps) => (
  <a 
    href={href}
    className="flex items-start p-4 hover:bg-neutral-700 transition-colors cursor-pointer"
  >
    <div className="mr-4 text-neutral-400">
      {icon}
    </div>
    <div>
      <h3 className="text-white font-medium">{title}</h3>
      <p className="text-sm text-neutral-400">{description}</p>
    </div>
    <div className="ml-auto text-neutral-400">
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
      </svg>
    </div>
  </a>
);

export default SettingsPage;
