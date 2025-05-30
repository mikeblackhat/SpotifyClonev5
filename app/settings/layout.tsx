import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Configuración - Spotify',
  description: 'Configura tu cuenta y preferencias',
};

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
