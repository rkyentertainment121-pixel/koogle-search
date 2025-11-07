'use client';

import { useSearchParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import type { SearchResult, SearchEngine } from '@/lib/types';
import { Bookmark, ExternalLink } from 'lucide-react';
import { getSearchResults } from '@/lib/actions';

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
    let domain = "unknown";
    try {
        domain = new URL(result.url).hostname;
    } catch (e) {
        console.error("Invalid URL for search result:", result.url);
    }

  return (
    <Card className="p-4 transition-all hover:shadow-md">
      <div className="flex justify-between items-start gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
            {domain !== "unknown" && (
              <img
                src={`https://www.google.com/s2/favicons?sz=16&domain_url=${domain}`}
                alt={`${domain} favicon`}
                width={16}
                height={16}
                className="rounded"
              />
            )}
            <span className="truncate">{domain}</span>
          </div>
          <a
            href={result.url}
            target="_blank"
            rel="noopener noreferrer"
            className="block"
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

export default function SearchResultsList() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q');
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
      <p className="text-sm text-muted-foreground">
        About {results.length} results ({totalTime} seconds) on {searchEngine}
      </p>
      {results.map((result, index) => (
        <SearchResultItem key={index} result={result} />
      ))}
    </div>
  );
}
