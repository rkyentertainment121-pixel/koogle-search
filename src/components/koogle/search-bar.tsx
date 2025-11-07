"use client";

import { Mic, Search, X, Loader2 } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useState, useEffect, useCallback, useRef } from "react";
import { useDebounce } from "@/hooks/use-debounce";
import { getSuggestions } from "@/lib/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { SearchEngine } from "@/lib/types";

const searchEngines: { name: SearchEngine, label: string; url: string; queryParam: string }[] = [
    { name: "koogle", label: "Koogle", url: "/search", queryParam: "q" },
    { name: "google", label: "Google", url: "/search", queryParam: "q" },
    { name: "bing", label: "Bing", url: "/search", queryParam: "q" },
    { name: "yahoo", label: "Yahoo", url: "/search", queryParam: "q" },
    { name: "duckduckgo", label: "DuckDuckGo", url: "/search", queryParam: "q" },
];

export default function SearchBar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(searchParams.get("q") || "");
  const [selectedEngine, setSelectedEngine] = useState<SearchEngine>("koogle");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isSuggestionsVisible, setSuggestionsVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const debouncedQuery = useDebounce(query, 300);
  const searchBarRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  
  const speechRecognitionRef = useRef<any>(null);

  useEffect(() => {
    const savedEngine = localStorage.getItem("searchEngine") as SearchEngine;
    if (savedEngine && searchEngines.some(e => e.name === savedEngine)) {
      setSelectedEngine(savedEngine);
    }
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined') {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (SpeechRecognition) {
            speechRecognitionRef.current = new SpeechRecognition();
            const recognition = speechRecognitionRef.current;
            recognition.continuous = false;
            recognition.lang = 'en-US';
            recognition.interimResults = false;
            recognition.maxAlternatives = 1;

            recognition.onresult = (event: any) => {
                const speechResult = event.results[0][0].transcript;
                setQuery(speechResult);
                handleSearch(speechResult);
            };
            
            recognition.onerror = (event: any) => {
                toast({
                    variant: "destructive",
                    title: "Voice Search Error",
                    description: `Error occurred in recognition: ${event.error}`,
                });
                setIsListening(false);
            };

            recognition.onend = () => {
                setIsListening(false);
            };
        }
    }
  }, [toast]);


  const fetchSuggestions = useCallback(async (searchQuery: string) => {
    if (searchQuery.length > 1) {
      setIsLoading(true);
      const result = await getSuggestions(searchQuery);
      setSuggestions(result.suggestions || []);
      setIsLoading(false);
      if (result.suggestions && result.suggestions.length > 0) {
        setSuggestionsVisible(true);
      }
    } else {
      setSuggestions([]);
      setSuggestionsVisible(false);
    }
  }, []);

  useEffect(() => {
    fetchSuggestions(debouncedQuery);
  }, [debouncedQuery, fetchSuggestions]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchBarRef.current && !searchBarRef.current.contains(event.target as Node)) {
        setSuggestionsVisible(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleEngineChange = (engine: SearchEngine) => {
    setSelectedEngine(engine);
    localStorage.setItem("searchEngine", engine);
    setSuggestionsVisible(false);
  };

  const handleSearch = (searchQuery: string) => {
    if (searchQuery.trim() !== "") {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSuggestionsVisible(false);
    }
  };

  const handleFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    handleSearch(query);
  };
  
  const handleVoiceSearch = () => {
    if (speechRecognitionRef.current) {
        if (!isListening) {
            speechRecognitionRef.current.start();
            setIsListening(true);
        } else {
            speechRecognitionRef.current.stop();
            setIsListening(false);
        }
    } else {
        toast({
            variant: "destructive",
            title: "Browser not supported",
            description: "Your browser does not support voice recognition.",
        });
    }
  };


  return (
    <div className="w-full relative" ref={searchBarRef}>
      <form onSubmit={handleFormSubmit} className="relative">
        <div className="relative flex items-center">
        <Select value={selectedEngine} onValueChange={handleEngineChange}>
            <SelectTrigger className="absolute left-3 h-10 w-28 rounded-full border-none bg-muted focus:ring-0 focus:ring-offset-0">
                <SelectValue placeholder="Engine" />
            </SelectTrigger>
            <SelectContent>
                {searchEngines.map(engine => (
                    <SelectItem key={engine.name} value={engine.name}>{engine.label}</SelectItem>
                ))}
            </SelectContent>
        </Select>

          <Input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => query.length > 1 && setSuggestionsVisible(true)}
            placeholder="Search..."
            className="h-14 pl-36 pr-24 rounded-full text-lg shadow-lg focus-visible:ring-offset-2"
          />
          <div className="absolute right-4 flex items-center gap-2">
            {query && (
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-9 w-9 rounded-full"
                onClick={() => setQuery("")}
              >
                <X className="h-5 w-5" />
              </Button>
            )}
            <Button type="button" variant={isListening ? 'destructive' : 'ghost'} size="icon" className="h-9 w-9 rounded-full" onClick={handleVoiceSearch}>
              <Mic className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </form>
      {isSuggestionsVisible && (
        <Card className="absolute top-full mt-2 w-full shadow-lg z-10 animate-in fade-in-0 zoom-in-95">
          <CardContent className="p-2">
            {isLoading && (
              <div className="flex items-center justify-center p-4">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
              </div>
            )}
            {!isLoading && suggestions.length > 0 && (
              <ul className="space-y-1">
                {suggestions.map((suggestion, index) => (
                  <li key={index}>
                    <Button
                      variant="ghost"
                      className="w-full justify-start h-auto py-2 px-3 text-base"
                      onClick={() => {
                        setQuery(suggestion);
                        handleSearch(suggestion);
                      }}
                    >
                      <Search className="h-4 w-4 mr-3 text-muted-foreground" />
                      <span className="truncate">{suggestion}</span>
                    </Button>
                  </li>
                ))}
              </ul>
            )}
            {!isLoading && debouncedQuery.length > 1 && suggestions.length === 0 && (
                 <div className="text-center text-sm text-muted-foreground p-4">No suggestions found.</div>
            )}
          </CardContent>
        </Card>
      )}
      <div className="flex items-center space-x-2 mt-4 justify-center">
        <Switch id="private-search" />
        <Label htmlFor="private-search">Private Search</Label>
      </div>
    </div>
  );
}
