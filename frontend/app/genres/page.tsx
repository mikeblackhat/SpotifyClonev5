import { Suspense } from 'react';
import { GenresGrid, PageHeader } from '@/components';

export default function GenresPage() {
  return (
    <div className="flex flex-col gap-6 p-4 md:p-6">
      <PageHeader 
        title="Explorar géneros" 
        description="Descubre música por género"
      />
      
      <div className="w-full">
        <Suspense fallback={
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-spotify-green"></div>
          </div>
        }>
          <GenresGrid />
        </Suspense>
      </div>
    </div>
  );
}
