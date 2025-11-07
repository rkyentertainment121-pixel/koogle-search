"use server";

import { suggestWebsitesAndQueries } from "@/ai/flows/suggest-websites-and-queries";
import { getSearchResults as getSearchResultsFlow } from "@/ai/flows/get-search-results";
import { summarizeUrl as summarizeUrlFlow } from "@/ai/flows/summarize-url";

export const getSuggestions = async (inputText: string) => {
  if (!inputText) return { suggestions: [] };
  try {
    const result = await suggestWebsitesAndQueries({ inputText });
    return result;
  } catch (error) {
    console.error("Error fetching suggestions:", error);
    // In a real app, you might want to log this error to a monitoring service
    return { suggestions: [] };
  }
};

export const getSearchResults = async (query: string) => {
  if (!query) return { results: [] };
  try {
    const result = await getSearchResultsFlow({ query });
    return result;
  } catch (error) {
    console.error("Error fetching search results:", error);
    return { results: [] };
  }
}

export const summarizeUrl = async (url: string) => {
  if (!url) return { summary: "", error: "No URL provided." };
  try {
    const result = await summarizeUrlFlow({ url });
    if (result.summary.startsWith('Error:')) {
      return { summary: "", error: result.summary.replace('Error: ', '') };
    }
    return { summary: result.summary };
  } catch (error: any) {
    console.error("Error summarizing URL:", error);
    return { summary: "", error: error.message || "An unknown error occurred while generating the summary." };
  }
}
