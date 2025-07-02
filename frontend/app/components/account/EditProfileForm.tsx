'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { FaArrowLeft, FaUser, FaEnvelope, FaCalendarAlt, FaVenusMars, FaGlobe, FaCheckCircle } from 'react-icons/fa';
import ReactCountryFlag from 'react-country-flag';

// Lista completa de países con códigos ISO
const COUNTRIES = [
  { code: 'AF', name: 'Afganistán' },
  { code: 'AL', name: 'Albania' },
  { code: 'DE', name: 'Alemania' },
  { code: 'AD', name: 'Andorra' },
  { code: 'AO', name: 'Angola' },
  { code: 'AI', name: 'Anguila' },
  { code: 'AQ', name: 'Antártida' },
  { code: 'AG', name: 'Antigua y Barbuda' },
  { code: 'SA', name: 'Arabia Saudita' },
  { code: 'DZ', name: 'Argelia' },
  { code: 'AR', name: 'Argentina' },
  { code: 'AM', name: 'Armenia' },
  { code: 'AW', name: 'Aruba' },
  { code: 'AU', name: 'Australia' },
  { code: 'AT', name: 'Austria' },
  { code: 'AZ', name: 'Azerbaiyán' },
  { code: 'BS', name: 'Bahamas' },
  { code: 'BD', name: 'Bangladés' },
  { code: 'BB', name: 'Barbados' },
  { code: 'BH', name: 'Baréin' },
  { code: 'BE', name: 'Bélgica' },
  { code: 'BZ', name: 'Belice' },
  { code: 'BJ', name: 'Benín' },
  { code: 'BM', name: 'Bermudas' },
  { code: 'BY', name: 'Bielorrusia' },
  { code: 'BO', name: 'Bolivia' },
  { code: 'BA', name: 'Bosnia y Herzegovina' },
  { code: 'BW', name: 'Botsuana' },
  { code: 'BR', name: 'Brasil' },
  { code: 'BN', name: 'Brunéi' },
  { code: 'BG', name: 'Bulgaria' },
  { code: 'BF', name: 'Burkina Faso' },
  { code: 'BI', name: 'Burundi' },
  { code: 'BT', name: 'Bután' },
  { code: 'CV', name: 'Cabo Verde' },
  { code: 'KH', name: 'Camboya' },
  { code: 'CM', name: 'Camerún' },
  { code: 'CA', name: 'Canadá' },
  { code: 'QA', name: 'Catar' },
  { code: 'TD', name: 'Chad' },
  { code: 'CL', name: 'Chile' },
  { code: 'CN', name: 'China' },
  { code: 'CY', name: 'Chipre' },
  { code: 'VA', name: 'Ciudad del Vaticano' },
  { code: 'CO', name: 'Colombia' },
  { code: 'KM', name: 'Comoras' },
  { code: 'CG', name: 'Congo' },
  { code: 'KP', name: 'Corea del Norte' },
  { code: 'KR', name: 'Corea del Sur' },
  { code: 'CI', name: 'Costa de Marfil' },
  { code: 'CR', name: 'Costa Rica' },
  { code: 'HR', name: 'Croacia' },
  { code: 'CU', name: 'Cuba' },
  { code: 'CW', name: 'Curazao' },
  { code: 'DK', name: 'Dinamarca' },
  { code: 'DM', name: 'Dominica' },
  { code: 'EC', name: 'Ecuador' },
  { code: 'EG', name: 'Egipto' },
  { code: 'SV', name: 'El Salvador' },
  { code: 'AE', name: 'Emiratos Árabes Unidos' },
  { code: 'ER', name: 'Eritrea' },
  { code: 'SK', name: 'Eslovaquia' },
  { code: 'SI', name: 'Eslovenia' },
  { code: 'ES', name: 'España' },
  { code: 'US', name: 'Estados Unidos' },
  { code: 'EE', name: 'Estonia' },
  { code: 'ET', name: 'Etiopía' },
  { code: 'PH', name: 'Filipinas' },
  { code: 'FI', name: 'Finlandia' },
  { code: 'FJ', name: 'Fiyi' },
  { code: 'FR', name: 'Francia' },
  { code: 'GA', name: 'Gabón' },
  { code: 'GM', name: 'Gambia' },
  { code: 'GE', name: 'Georgia' },
  { code: 'GH', name: 'Ghana' },
  { code: 'GI', name: 'Gibraltar' },
  { code: 'GD', name: 'Granada' },
  { code: 'GR', name: 'Grecia' },
  { code: 'GL', name: 'Groenlandia' },
  { code: 'GP', name: 'Guadalupe' },
  { code: 'GU', name: 'Guam' },
  { code: 'GT', name: 'Guatemala' },
  { code: 'GF', name: 'Guayana Francesa' },
  { code: 'GG', name: 'Guernsey' },
  { code: 'GN', name: 'Guinea' },
  { code: 'GQ', name: 'Guinea Ecuatorial' },
  { code: 'GW', name: 'Guinea-Bisáu' },
  { code: 'GY', name: 'Guyana' },
  { code: 'HT', name: 'Haití' },
  { code: 'HN', name: 'Honduras' },
  { code: 'HK', name: 'Hong Kong' },
  { code: 'HU', name: 'Hungría' },
  { code: 'IN', name: 'India' },
  { code: 'ID', name: 'Indonesia' },
  { code: 'IQ', name: 'Irak' },
  { code: 'IR', name: 'Irán' },
  { code: 'IE', name: 'Irlanda' },
  { code: 'BV', name: 'Isla Bouvet' },
  { code: 'IM', name: 'Isla de Man' },
  { code: 'CX', name: 'Isla de Navidad' },
  { code: 'NF', name: 'Isla Norfolk' },
  { code: 'IS', name: 'Islandia' },
  { code: 'KY', name: 'Islas Caimán' },
  { code: 'CC', name: 'Islas Cocos' },
  { code: 'CK', name: 'Islas Cook' },
  { code: 'FO', name: 'Islas Feroe' },
  { code: 'GS', name: 'Islas Georgias del Sur y Sandwich del Sur' },
  { code: 'HM', name: 'Islas Heard y McDonald' },
  { code: 'FK', name: 'Islas Malvinas' },
  { code: 'MP', name: 'Islas Marianas del Norte' },
  { code: 'MH', name: 'Islas Marshall' },
  { code: 'PN', name: 'Islas Pitcairn' },
  { code: 'SB', name: 'Islas Salomón' },
  { code: 'TC', name: 'Islas Turcas y Caicos' },
  { code: 'UM', name: 'Islas Ultramar de Estados Unidos' },
  { code: 'VG', name: 'Islas Vírgenes Británicas' },
  { code: 'VI', name: 'Islas Vírgenes de los Estados Unidos' },
  { code: 'IL', name: 'Israel' },
  { code: 'IT', name: 'Italia' },
  { code: 'JM', name: 'Jamaica' },
  { code: 'JP', name: 'Japón' },
  { code: 'JE', name: 'Jersey' },
  { code: 'JO', name: 'Jordania' },
  { code: 'KZ', name: 'Kazajistán' },
  { code: 'KE', name: 'Kenia' },
  { code: 'KG', name: 'Kirguistán' },
  { code: 'KI', name: 'Kiribati' },
  { code: 'KW', name: 'Kuwait' },
  { code: 'LB', name: 'Líbano' },
  { code: 'LA', name: 'Laos' },
  { code: 'LS', name: 'Lesoto' },
  { code: 'LV', name: 'Letonia' },
  { code: 'LR', name: 'Liberia' },
  { code: 'LY', name: 'Libia' },
  { code: 'LI', name: 'Liechtenstein' },
  { code: 'LT', name: 'Lituania' },
  { code: 'LU', name: 'Luxemburgo' },
  { code: 'MX', name: 'México' },
  { code: 'MC', name: 'Mónaco' },
  { code: 'MO', name: 'Macao' },
  { code: 'MK', name: 'Macedonia del Norte' },
  { code: 'MG', name: 'Madagascar' },
  { code: 'MY', name: 'Malasia' },
  { code: 'MW', name: 'Malaui' },
  { code: 'MV', name: 'Maldivas' },
  { code: 'ML', name: 'Malí' },
  { code: 'MT', name: 'Malta' },
  { code: 'MA', name: 'Marruecos' },
  { code: 'MQ', name: 'Martinica' },
  { code: 'MU', name: 'Mauricio' },
  { code: 'MR', name: 'Mauritania' },
  { code: 'YT', name: 'Mayotte' },
  { code: 'FM', name: 'Micronesia' },
  { code: 'MD', name: 'Moldavia' },
  { code: 'MN', name: 'Mongolia' },
  { code: 'ME', name: 'Montenegro' },
  { code: 'MS', name: 'Montserrat' },
  { code: 'MZ', name: 'Mozambique' },
  { code: 'MM', name: 'Myanmar' },
  { code: 'NA', name: 'Namibia' },
  { code: 'NR', name: 'Nauru' },
  { code: 'NP', name: 'Nepal' },
  { code: 'NI', name: 'Nicaragua' },
  { code: 'NE', name: 'Níger' },
  { code: 'NG', name: 'Nigeria' },
  { code: 'NU', name: 'Niue' },
  { code: 'NO', name: 'Noruega' },
  { code: 'NC', name: 'Nueva Caledonia' },
  { code: 'NZ', name: 'Nueva Zelanda' },
  { code: 'OM', name: 'Omán' },
  { code: 'NL', name: 'Países Bajos' },
  { code: 'PK', name: 'Pakistán' },
  { code: 'PW', name: 'Palaos' },
  { code: 'PA', name: 'Panamá' },
  { code: 'PG', name: 'Papúa Nueva Guinea' },
  { code: 'PY', name: 'Paraguay' },
  { code: 'PE', name: 'Perú' },
  { code: 'PF', name: 'Polinesia Francesa' },
  { code: 'PL', name: 'Polonia' },
  { code: 'PT', name: 'Portugal' },
  { code: 'PR', name: 'Puerto Rico' },
  { code: 'GB', name: 'Reino Unido' },
  { code: 'CF', name: 'República Centroafricana' },
  { code: 'CZ', name: 'República Checa' },
  { code: 'CD', name: 'República Democrática del Congo' },
  { code: 'DO', name: 'República Dominicana' },
  { code: 'RE', name: 'Reunión' },
  { code: 'RW', name: 'Ruanda' },
  { code: 'RO', name: 'Rumanía' },
  { code: 'RU', name: 'Rusia' },
  { code: 'EH', name: 'Sahara Occidental' },
  { code: 'WS', name: 'Samoa' },
  { code: 'AS', name: 'Samoa Americana' },
  { code: 'BL', name: 'San Bartolomé' },
  { code: 'KN', name: 'San Cristóbal y Nieves' },
  { code: 'SM', name: 'San Marino' },
  { code: 'MF', name: 'San Martín' },
  { code: 'PM', name: 'San Pedro y Miquelón' },
  { code: 'VC', name: 'San Vicente y las Granadinas' },
  { code: 'SH', name: 'Santa Elena' },
  { code: 'LC', name: 'Santa Lucía' },
  { code: 'ST', name: 'Santo Tomé y Príncipe' },
  { code: 'SN', name: 'Senegal' },
  { code: 'RS', name: 'Serbia' },
  { code: 'SC', name: 'Seychelles' },
  { code: 'SL', name: 'Sierra Leona' },
  { code: 'SG', name: 'Singapur' },
  { code: 'SX', name: 'Sint Maarten' },
  { code: 'SY', name: 'Siria' },
  { code: 'SO', name: 'Somalia' },
  { code: 'LK', name: 'Sri Lanka' },
  { code: 'SZ', name: 'Suazilandia' },
  { code: 'ZA', name: 'Sudáfrica' },
  { code: 'SD', name: 'Sudán' },
  { code: 'SS', name: 'Sudán del Sur' },
  { code: 'SE', name: 'Suecia' },
  { code: 'CH', name: 'Suiza' },
  { code: 'SR', name: 'Surinam' },
  { code: 'SJ', name: 'Svalbard y Jan Mayen' },
  { code: 'TH', name: 'Tailandia' },
  { code: 'TW', name: 'Taiwán' },
  { code: 'TZ', name: 'Tanzania' },
  { code: 'TJ', name: 'Tayikistán' },
  { code: 'IO', name: 'Territorio Británico del Océano Índico' },
  { code: 'TF', name: 'Tierras Australes Francesas' },
  { code: 'TL', name: 'Timor Oriental' },
  { code: 'TG', name: 'Togo' },
  { code: 'TK', name: 'Tokelau' },
  { code: 'TO', name: 'Tonga' },
  { code: 'TT', name: 'Trinidad y Tobago' },
  { code: 'TN', name: 'Túnez' },
  { code: 'TM', name: 'Turkmenistán' },
  { code: 'TR', name: 'Turquía' },
  { code: 'TV', name: 'Tuvalu' },
  { code: 'UA', name: 'Ucrania' },
  { code: 'UG', name: 'Uganda' },
  { code: 'UY', name: 'Uruguay' },
  { code: 'UZ', name: 'Uzbekistán' },
  { code: 'VU', name: 'Vanuatu' },
  { code: 'VE', name: 'Venezuela' },
  { code: 'VN', name: 'Vietnam' },
  { code: 'WF', name: 'Wallis y Futuna' },
  { code: 'YE', name: 'Yemen' },
  { code: 'DJ', name: 'Yibuti' },
  { code: 'ZM', name: 'Zambia' },
  { code: 'ZW', name: 'Zimbabue' },
].sort((a, b) => a.name.localeCompare(b.name)); // Ordenar alfabéticamente
import { toast } from 'react-hot-toast';
import { Modal } from '@/components/shared/ui/Modal';

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
                    className="w-full text-sm bg-gray-800/80 border border-gray-700 rounded-lg px-4 py-2.5 text-white appearance-none focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-transparent transition-all duration-200 [&::-webkit-calendar-picker-indicator]:invert(0.5) [&::-webkit-calendar-picker-indicator]:cursor-pointer"
                  />
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
                <div className="relative flex items-center">
                  {profile.country && (
                    <div className="absolute left-3 z-10 flex items-center h-full">
                      <ReactCountryFlag 
                        countryCode={profile.country} 
                        svg 
                        style={{
                          width: '1.25em',
                          height: '1.25em',
                          borderRadius: '2px',
                          objectFit: 'cover',
                          boxShadow: 'none',
                          border: 'none',
                          lineHeight: '1em',
                          display: 'inline-block'
                        }}
                        title={COUNTRIES.find(c => c.code === profile.country)?.name}
                      />
                    </div>
                  )}
                  <select
                    id="country"
                    name="country"
                    value={profile.country}
                    onChange={handleChange}
                    className={`w-full text-sm bg-gray-800/80 border border-gray-700 rounded-lg py-2.5 pr-10 text-white appearance-none focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-transparent transition-all duration-200 cursor-pointer ${
                      profile.country ? 'pl-12' : 'pl-4'
                    }`}
                  >
                    {COUNTRIES.map((country) => (
                      <option key={country.code} value={country.code}>
                        {country.name}
                      </option>
                    ))}
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
