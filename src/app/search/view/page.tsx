'use client';

import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

function View() {
  const searchParams = useSearchParams();
  const url = searchParams.get('url');

  if (!url) {
    return <div className="flex items-center justify-center h-full">Invalid URL</div>;
  }

  return (
    <iframe
      src={url}
      className="w-full h-full border-0"
      title="Search Result"
    />
  );
}

export default function ViewPage() {
  return (
    <div className="w-screen h-screen flex flex-col">
      <Suspense fallback={<Skeleton className="w-full h-full" />}>
        <View />
      </Suspense>
    </div>
  );
}
