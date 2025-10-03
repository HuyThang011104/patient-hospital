import { createClient } from "@supabase/supabase-js";
import { projectId, publicAnonKey } from "./info";

const supabaseUrl = `https://${projectId}.supabase.co`;

export const supabase = createClient(supabaseUrl, publicAnonKey);

// Helper function to make server requests
export async function serverRequest(
  endpoint: string,
  options: RequestInit = {}
) {
  const url = `https://${projectId}.supabase.co/functions/v1/make-server-f663c2c0${endpoint}`;

  const response = await fetch(url, {
    ...options,
    headers: {
      Authorization: `Bearer ${publicAnonKey}`,
      "Content-Type": "application/json",
      ...options.headers,
    },
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Server request failed: ${error}`);
  }

  return response.json();
}
