'use server';

/**
 * @fileOverview Implements an AI-powered URL summarizer.
 *
 * This file defines a Genkit flow that takes a URL, fetches its content,
 * and uses an AI model to generate a concise summary.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const SummarizeUrlInputSchema = z.object({
  url: z.string().url().describe('The URL of the webpage to summarize.'),
});
export type SummarizeUrlInput = z.infer<typeof SummarizeUrlInputSchema>;

const SummarizeUrlOutputSchema = z.object({
  summary: z.string().describe('A concise summary of the webpage content.'),
});
export type SummarizeUrlOutput = z.infer<typeof SummarizeUrlOutputSchema>;

// This is a simple, placeholder implementation for fetching URL content.
// In a real-world scenario, you would use a more robust library like axios or node-fetch,
// and handle various content types and potential errors gracefully.
const fetchUrlContent = ai.defineTool(
  {
    name: 'fetchUrlContent',
    description: 'Fetches the text content of a given URL.',
    inputSchema: z.object({
      url: z.string().url(),
    }),
    outputSchema: z.string(),
  },
  async ({ url }) => {
    try {
      // NOTE: This is a simplified example. A production implementation
      // should handle various content types, character encodings, and errors.
      // It also doesn't handle dynamic/JS-rendered content.
      const response = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0' } });
      if (!response.ok) {
        return `Error: Could not fetch content. Server responded with status: ${response.status}`;
      }
      const text = await response.text();
      // Basic HTML tag stripping. A more robust solution like cheerio would be better.
      const cleanText = text.replace(/<style[^>]*>.*<\/style>/gs, '')
                             .replace(/<script[^>]*>.*<\/script>/gs, '')
                             .replace(/<[^>]*>/g, '')
                             .replace(/\s\s+/g, ' ')
                             .trim();

      if (!cleanText) {
        return 'Error: Could not extract any readable text from the URL.';
      }
      
      return cleanText.substring(0, 8000);
    } catch (e: any) {
      return `Error: Failed to fetch URL content. This could be due to network issues or the website's security policies (CORS). Details: ${e.message}`;
    }
  }
);


export async function summarizeUrl(input: SummarizeUrlInput): Promise<SummarizeUrlOutput> {
  return summarizeUrlFlow(input);
}

const prompt = ai.definePrompt({
  name: 'summarizeUrlPrompt',
  input: { schema: SummarizeUrlInputSchema },
  output: { schema: SummarizeUrlOutputSchema },
  tools: [fetchUrlContent],
  prompt: `Please fetch the content of the provided URL and generate a concise, easy-to-read summary of the webpage. The summary should capture the main points and key information. If you receive an error message when fetching, explain the error to the user instead of summarizing.

URL to summarize: {{{url}}}`,
});

const summarizeUrlFlow = ai.defineFlow(
  {
    name: 'summarizeUrlFlow',
    inputSchema: SummarizeUrlInputSchema,
    outputSchema: SummarizeUrlOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
