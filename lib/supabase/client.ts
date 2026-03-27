import { createBrowserClient } from "@supabase/ssr";
import type { Database, Json } from "@/lib/types/database.types";

/**
 * Creates a Supabase client for use in Client Components (browser).
 * Used by the admin panel for auth and mutations.
 */
export function createClient() {
  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

/** Cast a typed object to Supabase's Json type for use in upsert/insert calls. */
export function toJson(value: unknown): Json {
  return value as Json;
}
