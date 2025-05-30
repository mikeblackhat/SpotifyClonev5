"use client";

import Link from "next/link";

const GuestHome = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 text-center bg-black">
      <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">Disfruta de tu música</h1>
      <p className="text-neutral-400 text-lg mb-8 max-w-2xl">
        Millones de canciones y podcasts. No necesitas tarjeta de crédito.
      </p>
      <Link 
        href="/auth/signup" 
        className="bg-green-500 hover:bg-green-600 text-black font-bold py-3 px-8 rounded-full text-sm uppercase tracking-wider transition-colors mb-4"
      >
        Regístrate gratis
      </Link>
      <div className="mt-4">
        <p className="text-neutral-400 text-sm">
          ¿Ya tienes una cuenta?{' '}
          <Link href="/auth/signin" className="text-white hover:underline">
            Inicia sesión
          </Link>
        </p>
      </div>
    </div>
  );
};

export default GuestHome;
