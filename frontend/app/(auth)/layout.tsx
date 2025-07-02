import { ReactNode } from 'react';

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-neutral-950 to-black text-white flex flex-col">
      {children}
    </div>
  );
}
