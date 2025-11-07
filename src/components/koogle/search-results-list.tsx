"use client";

import { useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import type { SearchResult } from "@/lib/types";
import { Globe, Bookmark, ExternalLink } from "lucide-react";

const mockSearchResults: SearchResult[] = [
    { title: "React – A JavaScript library for building user interfaces", url: "https://react.dev", description: "React makes it painless to create interactive UIs. Design simple views for each state in your application, and React will efficiently update and render just the right components when your data changes." },
    { title: "Tailwind CSS - Rapidly build modern websites without ever leaving your HTML.", url: "https://tailwindcss.com", description: "A utility-first CSS framework packed with classes like flex, pt-4, text-center and rotate-90 that can be composed to build any design, directly in your markup." },
    { title: "Next.js by Vercel - The React Framework", url: "https://nextjs.org", description: "Next.js enables you to create full-stack Web applications by extending the latest React features, and integrating powerful Rust-based JavaScript tooling for the fastest builds." },
    { title: "Firebase | The comprehensive app development platform", url: "https://firebase.google.com", description: "Firebase is an app development platform that helps you build and grow apps and games users love. Backed by Google and trusted by millions of businesses around the world." },
    { title: "Brave Browser | Secure, Fast & Private Web Browser with Adblocker", url: "https://brave.com/", description: "The Brave browser is a fast, private and secure web browser for PC, Mac and mobile. Download now to enjoy a faster ad-free browsing experience that saves data and battery life by blocking tracking software." }
];

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
    )
}

const SearchResultItem = ({ result }: { result: SearchResult }) => {
    const domain = new URL(result.url).hostname;
    return (
        <Card className="p-4 transition-all hover:shadow-md">
            <div className="flex justify-between items-start gap-4">
                <div className="flex-1">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                        <img 
                            src={`https://www.google.com/s2/favicons?sz=16&domain_url=${domain}`} 
                            alt={`${domain} favicon`} 
                            width={16} 
                            height={16} 
                            className="rounded"
                        />
                        <span className="truncate">{domain}</span>
                    </div>
                    <a href={result.url} target="_blank" rel="noopener noreferrer" className="block">
                        <h3 className="text-xl font-semibold text-primary-foreground font-headline text-blue-700 dark:text-blue-400 hover:underline">{result.title}</h3>
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
    const query = searchParams.get("q");
    const [results, setResults] = useState<SearchResult[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        // Simulate API call
        const timer = setTimeout(() => {
            if (query) {
                // simple filter for mock results
                const filteredResults = mockSearchResults.filter(r => 
                    r.title.toLowerCase().includes(query.toLowerCase()) || 
                    r.description.toLowerCase().includes(query.toLowerCase())
                );
                // Add the query as the top result
                setResults([
                    { title: `Search results for "${query}"`, url: `https://google.com/search?q=${encodeURIComponent(query)}`, description: `Showing web results for your search. To see more, visit Google.` },
                    ...filteredResults, 
                    ...mockSearchResults,
                ].filter((v,i,a)=>a.findIndex(v2=>(v2.url===v.url))===i).slice(0, 8));
            } else {
                setResults([]);
            }
            setLoading(false);
        }, 1000);

        return () => clearTimeout(timer);
    }, [query]);

    if (loading) {
        return <SearchResultsSkeleton />;
    }

    if (!query) {
        return <div className="text-center text-muted-foreground py-10">Please enter a search query.</div>
    }

    if (results.length === 0) {
        return <div className="text-center text-muted-foreground py-10">No results found for &quot;{query}&quot;.</div>;
    }

    return (
        <div className="space-y-6">
            <p className="text-sm text-muted-foreground">About {results.length} results (0.42 seconds)</p>
            {results.map((result, index) => (
                <SearchResultItem key={index} result={result} />
            ))}
        </div>
    );
}
