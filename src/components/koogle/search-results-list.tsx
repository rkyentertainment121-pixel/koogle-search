
'use client';

import { useSearchParams } from 'next/navigation';
import React, { useEffect, useState, useContext } from 'react';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import type { SearchResult, SearchEngine } from '@/lib/types';
import { Bookmark, ExternalLink, Globe } from 'lucide-react';
import { getSearchResults } from '@/lib/actions';
import { TabsContext } from '@/components/providers/tabs-provider';

function SearchResultsSkeleton() {
  return (
    <div className="space-y-6">
      {Array.from({ length: 5 }).map((_, i) => (
        <Card key={i} className="p-4">
          <div className="flex flex-col space-y-3">
            <Skeleton className="h-4 w-48" />
            <Skeleton className="h-5 w-80" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        </Card>
      ))}
    </div>
  );
}

const SearchResultItem = ({ result }: { result: SearchResult }) => {
    const { addTab } = useContext(TabsContext);
    let domain = "unknown";
    try {
        domain = new URL(result.url).hostname;
    } catch (e) {
        console.error("Invalid URL for search result:", result.url);
    }

  const handleResultClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    addTab(result.url, result.title);
  };
  
  const faviconUrl = `https://www.google.com/s2/favicons?sz=16&domain_url=${domain}`;

  return (
    <Card className="p-4 transition-all hover:shadow-md rounded-none border-x-0 border-t-0">
      <div className="flex justify-between items-start gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
            {domain !== "unknown" ? (
              <img
                src={faviconUrl}
                alt={`${domain} favicon`}
                width={16}
                height={16}
                className="rounded"
                onError={(e) => e.currentTarget.style.display = 'none'}
              />
            ) : <Globe className="w-4 h-4" /> }
            <span className="truncate">{domain}</span>
          </div>
          <a
            href={result.url}
            onClick={handleResultClick}
            className="block cursor-pointer"
          >
            <h3 className="text-xl font-semibold text-primary-foreground font-headline text-blue-700 dark:text-blue-400 hover:underline">
              {result.title}
            </h3>
          </a>
          <p className="mt-2 text-muted-foreground">{result.description}</p>
        </div>
        <div className="flex flex-col gap-2">
          <Bookmark className="h-5 w-5 text-muted-foreground hover:text-primary cursor-pointer" />
          <a href={result.url} target="_blank" rel="noopener noreferrer">
            <ExternalLink className="h-5 w-5 text-muted-foreground hover:text-primary cursor-pointer" />
          </a>
        </div>
      </div>
    </Card>
  );
};

export default function SearchResultsList({ query }: { query: string | null }) {
  const searchParams = useSearchParams();
  const searchEngine = (searchParams.get('engine') as SearchEngine) || 'koogle';
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalTime, setTotalTime] = useState(0);

  useEffect(() => {
    if (query) {
      setLoading(true);
      const startTime = performance.now();
      getSearchResults(query, searchEngine).then((searchResult) => {
        const endTime = performance.now();
        setTotalTime(Number(((endTime - startTime) / 1000).toFixed(2)));
        setResults(searchResult.results);
        setLoading(false);
      });
    } else {
      setResults([]);
      setLoading(false);
    }
  }, [query, searchEngine]);

  if (loading) {
    return <SearchResultsSkeleton />;
  }

  if (!query) {
    return (
      <div className="text-center text-muted-foreground py-10">
        Please enter a search query.
      </div>
    );
  }

  if (results.length === 0) {
    return (
      <div className="text-center text-muted-foreground py-10">
        No results found for &quot;{query}&quot;.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <p className="text-sm text-muted-foreground px-4 md:px-6">
        About {results.length} results ({totalTime} seconds)
      </p>
      {results.map((result, index) => (
        <SearchResultItem key={index} result={result} />
      ))}
    </div>
  );
}
