
'use client';

import { useSearchParams } from 'next/navigation';
import { Suspense, useContext, useEffect, useState, useMemo } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { TabsContext } from '@/components/providers/tabs-provider';
import SearchBar from '@/components/koogle/search-bar';
import ShortcutGrid from '@/components/koogle/shortcut-grid';
import PrivacyStats from '@/components/koogle/privacy-stats';
import SearchResultsList from '@/components/koogle/search-results-list';

function IframeView({ url, onTitleLoad }: { url: string, onTitleLoad: (title: string) => void }) {
  const [iframeKey, setIframeKey] = useState(Date.now());

  useEffect(() => {
    setIframeKey(Date.now());
  }, [url]);

  if (!url) {
    return <div className="flex items-center justify-center h-full">Invalid URL</div>;
  }

  return (
    <iframe
      key={iframeKey}
      src={url}
      className="w-full h-full border-0"
      title="Search Result"
      sandbox="allow-forms allow-modals allow-pointer-lock allow-popups allow-popups-to-escape-sandbox allow-presentation allow-same-origin allow-scripts"
      onLoad={(e) => {
        try {
          const title = (e.currentTarget.contentDocument?.title) || "New Tab";
          onTitleLoad(title);
        } catch (error) {
          console.warn('Could not access iframe title:', error);
          onTitleLoad("New Tab");
        }
      }}
      onError={() => onTitleLoad("Failed to load")}
    />
  );
}

export default function ViewPage() {
  const { activeTab, updateTabTitle } = useContext(TabsContext);
  const [currentUrl, setCurrentUrl] = useState(activeTab?.url);

  useEffect(() => {
    setCurrentUrl(activeTab?.url);
  }, [activeTab]);


  const handleTitleLoad = (title: string) => {
    if (activeTab) {
      updateTabTitle(activeTab.id, title);
    }
  };

  const isNewTab = currentUrl === 'koogle:newtab';
  const isSearch = currentUrl?.startsWith('koogle:search?q=');
  const query = isSearch ? decodeURIComponent(currentUrl.split('?q=')[1]) : '';

  if (isNewTab) {
    return (
        <div className="flex flex-col min-h-screen">
            <main className="flex-1 flex flex-col items-center justify-center p-4 md:p-8">
                <div className="w-full max-w-2xl flex flex-col items-center gap-8">
                <h1 className="text-5xl md:text-7xl font-bold font-headline text-center tracking-tighter">
                    Koogle Search
                </h1>
                <SearchBar />
                <ShortcutGrid />
                </div>
            </main>
            <PrivacyStats />
        </div>
    )
  }

  if (isSearch) {
    return (
       <main className="flex-1 overflow-y-auto w-full">
        <div className="mx-auto px-4 md:px-6">
            <Suspense fallback={<Skeleton className="h-20 w-full" />}>
              <SearchBar initialQuery={query} showProgressBar={true} />
            </Suspense>
            <div className="mt-8">
                <Suspense fallback={
                    <div className="space-y-4 pt-4">
                        {Array.from({ length: 5 }).map((_, i) => (
                            <div key={i} className="flex flex-col space-y-3">
                                <Skeleton className="h-4 w-48" />
                                <Skeleton className="h-5 w-80" />
                                <Skeleton className="h-4 w-full" />
                                <Skeleton className="h-4 w-3/4" />
                            </div>
                        ))}
                    </div>
                }>
                    <SearchResultsList query={query} />
                </Suspense>
            </div>
        </div>
      </main>
    )
  }
  
  if (currentUrl) {
    return (
        <div className="w-full h-full flex flex-col">
            <Suspense fallback={<Skeleton className="w-full h-full" />}>
                <IframeView url={currentUrl} onTitleLoad={handleTitleLoad} />
            </Suspense>
        </div>
    );
  }

  return (
    <div className="flex items-center justify-center h-full text-muted-foreground">
        Select or create a new tab to start browsing.
    </div>
  );
}
