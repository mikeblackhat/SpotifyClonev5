'use client';

import EditProfileForm from '@/app/components/account/EditProfileForm';

export default function EditProfilePage() {
  return (
    <div className="min-h-[calc(100vh-80px)] bg-gradient-to-b from-gray-900 to-black text-white">
      <div className="container mx-auto px-4 py-6 max-w-4xl">
        <EditProfileForm />
      </div>
    </div>
  );
}
