'use client';

import React, { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ExternalLink, RefreshCw, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { summarizeUrl } from '@/lib/actions';
import { Skeleton } from '@/components/ui/skeleton';

function SummarySkeleton() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-8 w-3/4" />
      <div className="space-y-2">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-4/6" />
      </div>
       <div className="space-y-2 pt-4">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-2/6" />
      </div>
    </div>
  )
}


function ViewPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const url = searchParams.get('url');
  
  const [summary, setSummary] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchSummary = async (targetUrl: string) => {
    setLoading(true);
    setError('');
    setSummary('');
    try {
      const result = await summarizeUrl(targetUrl);
      if (result.summary) {
        setSummary(result.summary);
      } else {
        setError('Could not generate a summary for this page.');
      }
    } catch (err) {
      setError('An error occurred while generating the summary.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (url) {
      fetchSummary(url);
    }
  }, [url]);


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

  return (
    <div className="flex flex-col h-full w-full">
      <Card className="flex-shrink-0 rounded-none border-b border-t-0">
        <CardContent className="p-2 flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={() => router.back()}>
            <ArrowLeft />
            <span className="sr-only">Go Back</span>
          </Button>
          <div className="flex-1 px-2 py-1 bg-muted rounded-md text-sm text-muted-foreground truncate">
            {url}
          </div>
          <Button variant="ghost" size="icon" onClick={() => fetchSummary(url)} disabled={loading}>
            {loading ? <Loader2 className="animate-spin" /> : <RefreshCw />}
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
      <div className="flex-1 w-full h-full overflow-y-auto">
        <div className="container max-w-4xl mx-auto py-8">
            {loading && <SummarySkeleton />}
            {error && <p className="text-destructive text-center">{error}</p>}
            {summary && !loading && (
                 <Card>
                    <CardHeader>
                        <CardTitle>AI Summary</CardTitle>
                    </CardHeader>
                    <CardContent className="prose dark:prose-invert max-w-none">
                       <p>{summary}</p>
                    </CardContent>
                </Card>
            )}
        </div>
      </div>
    </div>
  );
}

export default function ViewPage() {
  return (
    <div className="fixed inset-0 bg-background z-50">
      <Suspense fallback={<div className="flex items-center justify-center h-full"><Loader2 className="h-8 w-8 animate-spin" /></div>}>
        <ViewPageContent />
      </Suspense>
    </div>
  );
}
