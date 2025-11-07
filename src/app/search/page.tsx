import React, { Suspense } from "react";
import Header from "@/components/koogle/header";
import SearchBar from "@/components/koogle/search-bar";
import SearchResultsList from "@/components/koogle/search-results-list";
import { Skeleton } from "@/components/ui/skeleton";

function SearchResultsSkeleton() {
    return (
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
    )
}

export default function SearchPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 container mx-auto p-4 md:p-6">
        <div className="max-w-4xl mx-auto">
            <Suspense fallback={<Skeleton className="h-14 w-full rounded-full" />}>
              <SearchBar />
            </Suspense>
            <div className="mt-8">
                <Suspense fallback={<SearchResultsSkeleton />}>
                    <SearchResultsList />
                </Suspense>
            </div>
        </div>
      </main>
    </div>
  );
}
