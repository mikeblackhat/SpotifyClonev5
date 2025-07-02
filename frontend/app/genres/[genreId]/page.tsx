import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import { PageHeader } from '@/components';
import GenreSongs from '@/components/features/browse/Genres/GenreSongs';

export default function GenrePage({ params }: { params: { genreId: string } }) {
  // Validar que el genreId sea un string
  if (!params.genreId || typeof params.genreId !== 'string') {
    notFound();
  }

  return (
    <div className="flex flex-col gap-6 p-4 md:p-6">
      <Suspense fallback={
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-spotify-green"></div>
        </div>
      }>
        <GenreSongs genreId={params.genreId} />
      </Suspense>
    </div>
  );
}
