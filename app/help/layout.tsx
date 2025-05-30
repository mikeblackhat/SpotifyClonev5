import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Ayuda - Spotify',
  description: 'Centro de ayuda de Spotify',
};

export default function HelpLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
