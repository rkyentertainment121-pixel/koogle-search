
import type { SearchEngine } from './types';

export const searchEngines: {
  name: SearchEngine;
  label: string;
  url?: string;
}[] = [
  { name: 'koogle', label: 'Koogle' },
  { name: 'google', label: 'Google', url: 'https://www.google.com/search?q=' },
  { name: 'bing', label: 'Bing', url: 'https://www.bing.com/search?q=' },
  { name: 'yahoo', label: 'Yahoo', url: 'https://search.yahoo.com/search?p=' },
  { name: 'duckduckgo', label: 'DuckDuckGo', url: 'https://duckduckgo.com/?q=' },
];
