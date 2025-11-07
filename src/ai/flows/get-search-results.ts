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

const SearchResultInputSchema = z.object({
  query: z.string().describe('The search query.'),
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
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
