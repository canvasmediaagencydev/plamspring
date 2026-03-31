import { createClient } from "@/lib/supabase/server";
import Footer, { FooterSettings } from "./Footer";

/**
 * Server component that fetches footer settings from Supabase
 * and renders the Footer. Use this on every public page instead of
 * importing Footer directly.
 */
export default async function FooterServer() {
  let settings: FooterSettings = {};
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("site_settings")
      .select("value")
      .eq("key", "footer")
      .single();
    if (data?.value) settings = data.value as FooterSettings;
  } catch {
    // fall back to Footer's DEFAULT_SETTINGS
  }

  return <Footer settings={settings} />;
}
