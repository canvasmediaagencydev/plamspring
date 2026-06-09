import { connectDB } from "@/lib/mongodb";
import { SiteSetting } from "@/lib/models";
import Footer, { FooterSettings } from "./Footer";

export default async function FooterServer() {
  let settings: FooterSettings = {};
  try {
    await connectDB();
    const doc = await SiteSetting.findOne({ key: "footer" }).lean();
    if (doc?.value) settings = doc.value as FooterSettings;
  } catch {
    // fall back to Footer's DEFAULT_SETTINGS
  }

  return <Footer settings={settings} />;
}
