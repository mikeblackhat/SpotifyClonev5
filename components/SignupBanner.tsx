"use client";
import { useSession } from "next-auth/react";
import Link from "next/link";

export default function SignupBanner() {
  const { status } = useSession();
  if (status === "authenticated") return null;
  return (
    <div className="w-full bg-gradient-to-r from-purple-700 via-blue-600 to-blue-400 text-white px-4 py-3 flex flex-col md:flex-row items-center justify-between gap-2 text-sm fixed bottom-0 left-0 z-40">
      <span className="font-semibold">Muestra de Spotify</span>
      <span className="flex-1 text-center md:text-left">Regístrate para acceder a canciones y podcasts ilimitados con algunos anuncios. No necesitas tarjeta de crédito.</span>
      <Link href="/auth/signup" className="bg-white text-black font-bold rounded-full px-4 py-2 text-sm hover:bg-neutral-200 transition">Regístrate gratis</Link>
    </div>
  );
}
