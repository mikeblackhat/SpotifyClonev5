'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface ConfirmationModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  onClose: () => void;
  redirectUrl?: string;
  redirectDelay?: number;
}

export default function ConfirmationModal({
  isOpen,
  title,
  message,
  onClose,
  redirectUrl = '/',
  redirectDelay = 3000,
}: ConfirmationModalProps) {
  const router = useRouter();

  useEffect(() => {
    if (!isOpen) return;

    const timer = setTimeout(() => {
      if (redirectUrl) {
        router.push(redirectUrl);
      }
    }, redirectDelay);

    return () => clearTimeout(timer);
  }, [isOpen, redirectUrl, redirectDelay, router]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-spotify-gray-dark rounded-lg p-6 w-full max-w-md">
        <div className="text-center">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-spotify-green mb-4">
            <svg
              className="h-6 w-6 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <h3 className="text-lg leading-6 font-medium text-white mb-2">
            {title}
          </h3>
          <div className="mt-2">
            <p className="text-sm text-gray-300">
              {message}
            </p>
          </div>
          <div className="mt-5 sm:mt-6">
            <button
              type="button"
              className="inline-flex justify-center w-full rounded-md border border-transparent shadow-sm px-4 py-2 bg-spotify-green text-base font-medium text-white hover:bg-spotify-green-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-spotify-green sm:text-sm"
              onClick={onClose}
            >
              ¡Entendido! Redirigiendo...
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
