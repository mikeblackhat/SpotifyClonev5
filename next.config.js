/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  env: {
    NEXTAUTH_URL: process.env.NEXTAUTH_URL || 'http://localhost:3000',
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET || 'your-secret-key-here',
  },
  
  // Configuración para Next.js 13+
  experimental: {
    serverActions: {
      bodySizeLimit: '2mb',
    },
  },
  
  // Configuración de webpack
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // Evita que se empaqueten módulos de Node.js en el lado del cliente
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        dns: false,
        child_process: false,
        dgram: false,
      };
      
      // Excluye @auth/mongodb-adapter del empaquetado del lado del cliente
      if (config.resolve.alias) {
        config.resolve.alias['@auth/mongodb-adapter'] = false;
      }
    }
    return config;
  },
  
};

// Configuración de encabezados de seguridad
const securityHeaders = [
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff',
  },
  {
    key: 'X-Frame-Options',
    value: 'SAMEORIGIN',
  },
  {
    key: 'X-XSS-Protection',
    value: '1; mode=block',
  },
];

// Añadir encabezados de seguridad
nextConfig.headers = async () => {
  return [
    {
      source: '/(.*)',
      headers: securityHeaders,
    },
  ];
};

module.exports = nextConfig;
