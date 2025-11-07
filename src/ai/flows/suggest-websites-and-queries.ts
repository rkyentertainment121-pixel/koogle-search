'use server';

/**
 * @fileOverview Implements an AI-powered suggestion system that recommends websites, trending searches, or similar queries based on user text input.
 *
 * @function suggestWebsitesAndQueries - The main function to generate suggestions.
 * @interface SuggestionInput - Defines the input schema for the suggestion function.
 * @interface SuggestionOutput - Defines the output schema for the suggestion function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestionInputSchema = z.object({
  inputText: z.string().describe('The text input from the search bar.'),
});
export type SuggestionInput = z.infer<typeof SuggestionInputSchema>;

const SuggestionOutputSchema = z.object({
  suggestions: z.array(z.string()).describe('An array of suggested websites, trending searches, or related queries.'),
});
export type SuggestionOutput = z.infer<typeof SuggestionOutputSchema>;

export async function suggestWebsitesAndQueries(input: SuggestionInput): Promise<SuggestionOutput> {
  return suggestWebsitesAndQueriesFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestionPrompt',
  input: {schema: SuggestionInputSchema},
  output: {schema: SuggestionOutputSchema},
  prompt: `Based on the user's input text: {{{inputText}}}, suggest relevant websites, trending searches, and related queries. Return the suggestions as an array of strings. Focus on diversity of suggestions and relevance to the input text.`, 
});

const suggestWebsitesAndQueriesFlow = ai.defineFlow(
  {
    name: 'suggestWebsitesAndQueriesFlow',
    inputSchema: SuggestionInputSchema,
    outputSchema: SuggestionOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
