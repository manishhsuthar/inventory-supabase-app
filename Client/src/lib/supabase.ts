import { createClient } from "@supabase/supabase-js";

const rawSupabaseUrl =
  import.meta.env.VITE_SUPABASE_URL || import.meta.env.VITE_SUPABSE_URL || "";
const supabaseUrl = rawSupabaseUrl.trim();
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    "Missing Supabase environment variables. Set VITE_SUPABASE_URL (or VITE_SUPABSE_URL) and VITE_SUPABASE_ANON_KEY.",
  );
}

let parsedUrl: URL;
try {
  parsedUrl = new URL(supabaseUrl);
} catch {
  throw new Error("Invalid VITE_SUPABASE_URL. Expected format: https://<project-ref>.supabase.co");
}

if (parsedUrl.protocol !== "https:") {
  throw new Error("Invalid VITE_SUPABASE_URL. URL must use https.");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
