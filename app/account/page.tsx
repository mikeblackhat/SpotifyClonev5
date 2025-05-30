'use client';

import { useRouter } from 'next/navigation';
import { BsSpotify, BsGem } from 'react-icons/bs';
import { FaUser, FaCreditCard, FaLock, FaHeadset } from 'react-icons/fa';
import { HiOutlineDocumentText } from 'react-icons/hi';
import { FiSearch, FiChevronRight } from 'react-icons/fi';

export default function AccountPage() {
  const plan = {
    name: 'Versión gratuita',
    icon: <BsSpotify className="text-2xl text-green-500" />,
    buttonText: 'Explorar planes',
    premiumCard: {
      icon: <BsGem className="text-2xl text-white" />,
      title: 'Unirte a Premium',
      description: 'Consigue acceso ilimitado a la música sin anuncios con una suscripción.'
    }
  };

  interface SectionItem {
    icon: React.ReactNode;
    text: string;
    href?: string;
  }

  interface Section {
    title: string;
    items: SectionItem[];
  }

  const sections: Section[] = [
    {
      title: 'Cuenta',
      items: [
        { 
          icon: <FaUser className="text-lg" />, 
          text: 'Editar perfil',
          href: '/account/edit'
        },
        { 
          icon: <FaLock className="text-lg" />, 
          text: 'Cambiar contraseña',
          href: '/account/change-password'
        },
        { 
          icon: <FaCreditCard className="text-lg" />, 
          text: 'Administrar tu suscripción' 
        },
        { 
          icon: <HiOutlineDocumentText className="text-lg" />, 
          text: 'Historial de pedidos' 
        },
      ]
    },
    {
      title: 'Pago',
      items: [
        { icon: <FaCreditCard className="text-lg" />, text: 'Métodos de pago' },
        { icon: <HiOutlineDocumentText className="text-lg" />, text: 'Facturas' },
      ]
    },
    {
      title: 'Ayuda',
      items: [
        { icon: <FaHeadset className="text-lg" />, text: 'Asistencia de Spotify' },
        { icon: <FaUser className="text-lg" />, text: 'Comunidad' },
      ]
    }
  ];

  const router = useRouter();

  const handleExplorePlans = () => {
    router.push('/premium');
  };

  return (
    <div className="min-h-screen bg-black text-white p-6 pb-32">
      <div className="max-w-2xl mx-auto">
        {/* Barra de búsqueda */}
        <div className="relative mb-8">
          <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar en tu cuenta o artículos de ayuda"
            className="w-full bg-gray-800 rounded-full py-3 pl-10 pr-4 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>

        {/* Sección de Plan */}
        <div className="bg-gray-900 rounded-lg p-6 mb-6">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center space-x-4">
              {plan.icon}
              <div>
                <h2 className="text-xl font-bold">Tu plan</h2>
                <p className="text-gray-400">{plan.name}</p>
              </div>
            </div>
            <button 
              onClick={handleExplorePlans}
              className="bg-white text-black px-6 py-2 rounded-full font-medium hover:bg-gray-200 transition"
            >
              {plan.buttonText}
            </button>
          </div>
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-6 flex items-start">
            <div className="bg-black bg-opacity-20 p-3 rounded-full mr-4">
              {plan.premiumCard.icon}
            </div>
            <div>
              <h3 className="text-xl font-bold mb-1">{plan.premiumCard.title}</h3>
              <p className="text-gray-200 text-sm">{plan.premiumCard.description}</p>
            </div>
          </div>
        </div>

        {/* Secciones de configuración */}
        {sections.map((section, index) => (
          <div key={index} className="mb-6">
            <h3 className="text-gray-400 text-sm font-medium uppercase mb-4">{section.title}</h3>
            <div className="bg-gray-900 rounded-lg overflow-hidden">
              {section.items.map((item, itemIndex) => (
                <div 
                  key={itemIndex}
                  onClick={() => item.href && router.push(item.href)}
                  className={`flex items-center justify-between p-4 hover:bg-gray-800 transition cursor-pointer ${item.href ? 'cursor-pointer' : 'cursor-not-allowed opacity-50'}`}
                >
                  <div className="flex items-center space-x-4">
                    <span className="text-gray-400">{item.icon}</span>
                    <span>{item.text}</span>
                  </div>
                  {item.href && <FiChevronRight className="text-gray-400" />}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
