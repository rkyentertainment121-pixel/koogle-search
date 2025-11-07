'use client';

import React, { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ExternalLink, RefreshCw } from 'lucide-react';
import { useRouter } from 'next/navigation';

function ViewPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const url = searchParams.get('url');

  if (!url) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center">
        <h2 className="text-2xl font-bold mb-4">No URL Provided</h2>
        <p className="text-muted-foreground mb-6">Please go back and try again.</p>
        <Button onClick={() => router.back()}>
          <ArrowLeft className="mr-2" />
          Go Back
        </Button>
      </div>
    );
  }

  const handleRefresh = () => {
    const iframe = document.getElementById('website-iframe') as HTMLIFrameElement;
    if (iframe) {
      iframe.src = iframe.src;
    }
  };

  return (
    <div className="flex flex-col h-full w-full">
      <Card className="flex-shrink-0 rounded-b-none border-b">
        <CardContent className="p-2 flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={() => router.back()}>
            <ArrowLeft />
            <span className="sr-only">Go Back</span>
          </Button>
          <div className="flex-1 px-2 py-1 bg-muted rounded-md text-sm text-muted-foreground truncate">
            {url}
          </div>
          <Button variant="ghost" size="icon" onClick={handleRefresh}>
            <RefreshCw />
            <span className="sr-only">Refresh</span>
          </Button>
          <a href={url} target="_blank" rel="noopener noreferrer">
            <Button variant="ghost" size="icon">
              <ExternalLink />
              <span className="sr-only">Open in new tab</span>
            </Button>
          </a>
        </CardContent>
      </Card>
      <div className="flex-1 w-full h-full">
        <iframe
          id="website-iframe"
          src={url}
          className="w-full h-full border-0"
          title="Website View"
          sandbox="allow-forms allow-modals allow-pointer-lock allow-popups allow-popups-to-escape-sandbox allow-same-origin allow-scripts"
        />
      </div>
    </div>
  );
}

export default function ViewPage() {
  return (
    <div className="fixed inset-0 bg-background z-50">
      <Suspense fallback={<div className="flex items-center justify-center h-full">Loading...</div>}>
        <ViewPageContent />
      </Suspense>
    </div>
  );
}