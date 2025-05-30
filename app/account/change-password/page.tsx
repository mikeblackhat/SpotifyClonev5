import { getServerSession } from 'next-auth/next';
import { redirect } from 'next/navigation';
import { authOptions } from '@/app/api/auth/[...nextauth]/auth-options';
import ChangePasswordForm from '../../components/account/ChangePasswordForm';

export default async function ChangePasswordPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/login?callbackUrl=/account/change-password');
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <ChangePasswordForm />
      </div>
    </div>
  );
}
