
'use server';

import { suggestWebsitesAndQueries } from '@/ai/flows/suggest-websites-and-queries';
import { getSearchResults as getSearchResultsFlow } from '@/ai/flows/get-search-results';
import type { SearchEngine } from './types';

export const getSuggestions = async (inputText: string) => {
  if (!inputText) return { suggestions: [] };
  try {
    const result = await suggestWebsitesAndQueries({ inputText });
    return result;
  } catch (error) {
    console.error('Error fetching suggestions:', error);
    // In a real app, you might want to log this to a monitoring service
    return { suggestions: [] };
  }
};

export const getSearchResults = async (query: string, searchEngine: SearchEngine) => {
  if (!query) return { results: [] };
  try {
    const result = await getSearchResultsFlow({ query, searchEngine });
    return result;
  } catch (error) {
    console.error('Error fetching search results:', error);
    return { results: [] };
  }
};
