'use server';

/**
 * @fileOverview Implements an AI-powered search result generation system.
 *
 * @function getSearchResults - The main function to generate search results.
 * @interface SearchResultInput - Defines the input schema for the search result function.
 * @interface SearchResultOutput - Defines the output schema for the search result function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import type { SearchEngine } from '@/lib/types';

const SearchResultInputSchema = z.object({
  query: z.string().describe('The search query.'),
  searchEngine: z.custom<SearchEngine>().describe('The search engine to use.'),
});
export type SearchResultInput = z.infer<typeof SearchResultInputSchema>;

const SearchResultSchema = z.object({
    title: z.string().describe("The title of the search result."),
    url: z.string().url().describe("The URL of the search result."),
    description: z.string().describe("A brief description of the search result."),
});

const SearchResultOutputSchema = z.object({
  results: z.array(SearchResultSchema).describe('An array of search results.'),
});
export type SearchResultOutput = z.infer<typeof SearchResultOutputSchema>;

export async function getSearchResults(input: SearchResultInput): Promise<SearchResultOutput> {
  return getSearchResultsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'searchResultPrompt',
  input: {schema: SearchResultInputSchema},
  output: {schema: SearchResultOutputSchema},
  prompt: `You are a search engine. Based on the user's query: {{{query}}}, generate a list of 5 to 10 relevant website search results. For each result, provide a title, a valid URL, and a concise description. Ensure the results are diverse and highly relevant to the query.`,
});

const getSearchResultsFlow = ai.defineFlow(
  {
    name: 'getSearchResultsFlow',
    inputSchema: SearchResultInputSchema,
    outputSchema: SearchResultOutputSchema,
  },
  async ({ query, searchEngine }) => {
    if (searchEngine === 'koogle') {
      const {output} = await prompt({ query, searchEngine });
      return output!;
    }

    // For external search engines, we will just generate dummy data
    // as we can't reliably scrape them.
    const { output } = await ai.generate({
      prompt: `Generate a fake but realistic-looking list of 10 search results for the query "${query}" from the search engine ${searchEngine}. For each result, provide a title, a valid but potentially fake URL, and a concise, plausible-sounding description.`,
      output: {
        schema: SearchResultOutputSchema,
      },
    });
    
    return output!;
  }
);
