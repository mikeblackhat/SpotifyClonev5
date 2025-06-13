'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { FaSpotify, FaCheck, FaTimes, FaCrown } from 'react-icons/fa';
import { BsArrowRight } from 'react-icons/bs';
import { useState, useEffect } from 'react';
import Link from 'next/link';

// Interfaz para los datos del usuario en la sesión
interface SessionUser {
  id: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
  plan?: string;
  provider?: string;
}

const PremiumPage = () => {
  const { data: session } = useSession();
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);

  // Efecto para seleccionar automáticamente el plan del usuario al cargar
  useEffect(() => {
    // Hacer un type assertion para asegurar que el usuario tiene el tipo correcto
    const user = session?.user as SessionUser | undefined;
    
    if (user) {
      // Usar el tipo de sesión correctamente tipado
      const userPlan = user.plan;
      console.log('Plan del usuario actual:', userPlan);
      
      if (userPlan) {
        // Convertir a minúsculas para comparación insensible a mayúsculas
        const userPlanLower = userPlan.toLowerCase();
        // Verificar si el plan del usuario existe en la lista de planes (comparación insensible)
        const matchingPlan = plans.find(plan => plan.id.toLowerCase() === userPlanLower);
        
        if (matchingPlan) {
          console.log('Plan encontrado:', matchingPlan.id, 'para el plan del usuario:', userPlan);
          console.log('Estableciendo plan seleccionado:', matchingPlan.id);
          setSelectedPlan(matchingPlan.id);
          return;
        } else {
          console.warn(`El plan '${userPlan}' no existe en la lista de planes disponibles`);
          // Si el plan no existe, establecer el plan gratuito por defecto
          setSelectedPlan('free');
        }
      } else {
        // Si no hay plan definido, establecer el plan gratuito por defecto
        console.log('Usuario sin plan definido, estableciendo plan por defecto: free');
        setSelectedPlan('free');
      }
    } else {
      // Si no hay sesión, establecer el plan gratuito por defecto
      console.log('No hay sesión activa, estableciendo plan por defecto: free');
      setSelectedPlan('free');
    }
  }, [session]);

  const plans = [
    {
      id: 'free',
      name: 'Free',
      price: 0,
      description: 'Para todos',
      features: [
        'Escucha música con anuncios',
        '5 saltos por hora',
        'Crea y comparte playlists',
        'Calidad de audio estándar'
      ],
      popular: false
    },
    {
      id: 'estudiante',
      name: 'Estudiante',
      price: 0.99,
      description: 'Para estudiantes universitarios',
      features: [
        'Descuento especial para estudiantes',
        'Música sin anuncios',
        'Reproducción on-demand',
        'Calidad de audio alta',
        'Se requiere verificación de estudiante',
        'Reproduce canciones de forma ilimitada'
      ],
      popular: false
    },
    {
      id: 'individual',
      name: 'Individual',
      price: 2.99,
      description: 'Para 1 cuenta',
      features: [
        'Escucha música sin anuncios',
        'Reproduce canciones en cualquier orden',
        'Escucha música sin conexión',
        'Reproducción on-demand',
        'Calidad de audio alta',
        'Reproduce canciones de forma ilimitada'
      ],
      popular: true
    },
    {
      id: 'artista',
      name: 'Artista',
      price: 9.99,
      description: 'Para creadores de música',
      features: [
        'Todo lo de Individual',
        'Sube y comparte tu música',
        'Agencia encargada de la publicidad de tus canciones',
        'Estadísticas detalladas de reproducción',
        'Distribución a todas las plataformas',
        'Y muchos beneficios más'
      ],
      popular: false
    }
  ];

  const handleSelectPlan = (planId: string) => {
    setSelectedPlan(planId);
  };

  const router = useRouter();

  const handleGoBack = () => {
    router.back();
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-black to-neutral-900 text-white pb-16 overflow-x-hidden">
      {/* Botón de retroceso */}
      <div className="container mx-auto px-4 pt-4">
        <button 
          onClick={handleGoBack}
          className="flex items-center text-gray-400 hover:text-white transition-colors text-sm mb-4"
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Volver
        </button>
      </div>
      
      {/* Hero Section */}
      <div className="bg-gradient-to-b from-green-600 to-black py-12 px-6 text-center">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-center mb-4">
            <FaSpotify className="text-3xl mr-2" />
            <span className="text-xl font-bold">Spotify Premium</span>
          </div>
          <h1 className="text-4xl font-bold mb-2">Elige tu plan Premium</h1>
          <p className="text-lg text-gray-300 mb-2">
            Escucha sin límites en tu teléfono, altavoces y otros dispositivos.
          </p>
          {session?.user && (
            <p className="text-sm text-green-500 font-medium mb-6">
              Tu plan actual: <span className="text-white">{(session.user as any)?.plan?.toUpperCase() || 'GRATIS'}</span>
            </p>
          )}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full">
            {plans.map((plan) => (
              <div 
                key={plan.id}
                className={`relative flex flex-col p-5 h-full w-full bg-black bg-opacity-30 rounded-lg cursor-pointer transition-all duration-300 border-2 min-h-[480px] max-w-[300px] mx-auto text-left ${
                  selectedPlan === plan.id ? 'border-green-500 bg-opacity-50' : 'border-transparent hover:border-gray-600'
                }`}
                onClick={() => handleSelectPlan(plan.id)}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-yellow-400 text-black text-[10px] font-bold px-3 py-1 rounded-full whitespace-nowrap">
                    MÁS POPULAR
                  </div>
                )}
                <div className="flex flex-col h-full justify-between text-left">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-lg font-bold">{plan.name}</h3>
                    {plan.popular && <FaCrown className="text-yellow-400 text-sm" />}
                  </div>
                  <p className="text-2xl font-bold mb-1">${plan.price}<span className="text-xs font-normal text-gray-400">/mes</span></p>
                  <p className="text-xs text-gray-400 mb-3">{plan.description}</p>
                  <div className="h-px bg-gray-700 my-2"></div>
                  <ul className="space-y-2 mb-4 mt-3 flex-grow overflow-y-auto max-h-[220px] pr-2">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-start">
                        <FaCheck className="text-green-500 mt-0.5 mr-1.5 flex-shrink-0 text-xs" />
                        <span className="text-xs">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="mt-6">
                    <button 
                      className={`w-full py-2 text-sm rounded-full font-bold text-black ${
                        selectedPlan === plan.id && plan.id === (session?.user as any)?.plan?.toLowerCase() 
                          ? 'bg-green-500 hover:bg-green-400' 
                          : 'bg-white hover:bg-gray-200'
                      }`}
                    >
                      {selectedPlan === plan.id && plan.id === (session?.user as any)?.plan?.toLowerCase() 
                        ? 'Plan Actual' 
                        : 'Seleccionar'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {selectedPlan && (
            <div className="mt-8 p-6 bg-black bg-opacity-30 rounded-lg max-w-2xl mx-4 sm:mx-auto">
              <h3 className="text-lg font-bold mb-3">Resumen de tu selección</h3>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                  <p className="font-medium text-sm">{plans.find(p => p.id === selectedPlan)?.name} Plan</p>
                  <p className="text-xs text-gray-400">${plans.find(p => p.id === selectedPlan)?.price} al mes</p>
                </div>
                <Link 
                  href={session ? "/checkout" : "/login?callbackUrl=/premium"}
                  className="bg-green-500 hover:bg-green-400 text-black font-bold py-2 px-4 text-sm rounded-full flex items-center justify-center gap-2 transition-colors w-full sm:w-auto"
                >
                  Continuar <BsArrowRight />
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-6xl mx-auto px-6 py-16">
        <h2 className="text-3xl font-bold text-center mb-12">¿Por qué elegir Premium?</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            {
              icon: '🎵',
              title: 'Modo sin conexión',
              description: 'Escucha música donde vayas, incluso sin conexión.'
            },
            {
              icon: '🔊',
              title: 'Mejor calidad de sonido',
              description: 'Disfruta de audio de alta calidad con sonido superior.'
            },
            {
              icon: '⏭️',
              title: 'Salta canciones',
              description: 'Salta canciones de forma ilimitada. Solo haz clic en Siguiente.'
            },
            {
              icon: '❌',
              title: 'Sin anuncios',
              description: 'Disfruta de música ininterrumpida sin anuncios.'
            }
          ].map((feature, index) => (
            <div key={index} className="text-center p-6 bg-neutral-800 rounded-lg hover:bg-neutral-700 transition-colors">
              <div className="text-4xl mb-4">{feature.icon}</div>
              <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
              <p className="text-gray-400">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* FAQ Section */}
      <div className="max-w-3xl mx-auto px-6 py-12">
        <h2 className="text-3xl font-bold text-center mb-8">Preguntas frecuentes</h2>
        <div className="space-y-4">
          {[
            {
              question: '¿Cómo funciona el período de prueba de Premium?',
              answer: 'Disfruta de 1 mes gratis de Premium. Después, se renovará automáticamente a la tarifa mensual estándar. Puedes cancelar en cualquier momento antes de que termine el período de prueba.'
            },
            {
              question: '¿Cómo cancelo mi suscripción Premium?',
              answer: 'Puedes cancelar tu suscripción en cualquier momento en la página de tu cuenta. Si cancelas durante el período de prueba, no se te cobrará.'
            },
            {
              question: '¿Puedo cambiar entre planes?',
              answer: 'Sí, puedes cambiar entre planes Premium en cualquier momento. Los cambios se aplicarán en tu próxima fecha de facturación.'
            },
            {
              question: '¿Qué métodos de pago aceptan?',
              answer: 'Aceptamos tarjetas de crédito y débito, PayPal y otros métodos de pago locales según tu país.'
            }
          ].map((item, index) => (
            <div key={index} className="border-b border-gray-800 pb-4">
              <h3 className="text-lg font-semibold mb-2">{item.question}</h3>
              <p className="text-gray-400">{item.answer}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PremiumPage;
