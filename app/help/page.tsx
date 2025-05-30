'use client';

const HelpPage = () => {
  return (
    <div className="p-6 max-w-4xl mx-auto mb-32">
      <h1 className="text-3xl font-bold text-white mb-8">Centro de ayuda</h1>
      
      <div className="grid gap-6 md:grid-cols-2">
        <HelpCard 
          title="Cuenta y perfil"
          description="Configuración de cuenta, métodos de pago y suscripción"
          icon="account"
        />
        <HelpCard 
          title="Reproducción"
          description="Soluciones para problemas de reproducción y calidad de audio"
          icon="play"
        />
        <HelpCard 
          title="Aplicaciones"
          description="Solución de problemas en dispositivos móviles y de escritorio"
          icon="devices"
        />
        <HelpCard 
          title="Suscripción"
          description="Información sobre planes, facturación y cancelaciones"
          icon="subscription"
        />
      </div>

      <div className="mt-12">
        <h2 className="text-2xl font-bold text-white mb-4">¿No encuentras lo que buscas?</h2>
        <div className="bg-neutral-800 p-6 rounded-lg">
          <p className="text-neutral-300 mb-4">Visita nuestra comunidad de soporte o contáctanos directamente</p>
          <div className="flex flex-wrap gap-4">
            <button className="px-6 py-2 bg-white text-black rounded-full font-medium hover:bg-neutral-200 transition">
              Comunidad
            </button>
            <button className="px-6 py-2 border border-neutral-500 text-white rounded-full font-medium hover:bg-neutral-700 transition">
              Contactar con soporte
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

type HelpCardProps = {
  title: string;
  description: string;
  icon: string;
};

const HelpCard = ({ title, description, icon }: HelpCardProps) => {
  const getIcon = (icon: string) => {
    switch (icon) {
      case 'account':
        return '👤';
      case 'play':
        return '▶️';
      case 'devices':
        return '📱';
      case 'subscription':
        return '💳';
      default:
        return '❓';
    }
  };

  return (
    <div className="bg-neutral-800 p-6 rounded-lg hover:bg-neutral-700 transition cursor-pointer">
      <div className="w-12 h-12 bg-neutral-700 rounded-full flex items-center justify-center mb-4">
        <span className="text-xl">{getIcon(icon)}</span>
      </div>
      <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>
      <p className="text-neutral-400 text-sm">{description}</p>
    </div>
  );
};

export default HelpPage;
