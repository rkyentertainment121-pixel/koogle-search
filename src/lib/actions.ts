"use server";

import { suggestWebsitesAndQueries } from "@/ai/flows/suggest-websites-and-queries";

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
