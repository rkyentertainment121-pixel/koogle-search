'use client';

import { useSearchParams } from 'next/navigation';
import { Suspense, useContext, useEffect, useMemo, useState } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { TabsContext } from '@/components/providers/tabs-provider';
import SearchBar from '@/components/koogle/search-bar';
import ShortcutGrid from '@/components/koogle/shortcut-grid';
import PrivacyStats from '@/components/koogle/privacy-stats';

function View() {
  const searchParams = useSearchParams();
  const url = searchParams.get('url');
  const { updateTabTitle } = useContext(TabsContext);
  const [iframeKey, setIframeKey] = useState(Date.now());
  
  const currentUrl = useMemo(() => {
    // This is to trick the iframe into reloading when the url is the same
    // but we want to force a refresh.
    if (url) {
        try {
            const urlObj = new URL(url);
            urlObj.searchParams.set('_t', iframeKey.toString());
            return urlObj.toString();
        } catch {
            return url;
        }
    }
    return url;
  }, [url, iframeKey]);

  useEffect(() => {
    setIframeKey(Date.now());
  }, [url]);

  if (!url) {
    return <div className="flex items-center justify-center h-full">Invalid URL</div>;
  }
  
  return (
    <iframe
      key={currentUrl}
      src={url} // We use the original url here to avoid issues with some sites
      className="w-full h-full border-0"
      title="Search Result"
      onLoad={(e) => {
        try {
          const title = (e.currentTarget.contentDocument?.title) || "New Tab";
          updateTabTitle(url, title);
        } catch (error) {
          console.warn('Could not access iframe title:', error);
          updateTabTitle(url, "New Tab");
        }
      }}
      onError={() => updateTabTitle(url, "Failed to load")}
    />
  );
}

export default function ViewPage({ isHomePage = false }: { isHomePage?: boolean }) {
  const { activeTab } = useContext(TabsContext);

  if (isHomePage || activeTab?.url === 'koogle:newtab') {
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

  return (
    <div className="w-full h-full flex flex-col">
      <Suspense fallback={<Skeleton className="w-full h-full" />}>
        <View />
      </Suspense>
    </div>
  );
}
