import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import "./globals.css";
import PublicStickyContact from "./components/PublicStickyContact";
import GoogleTranslateProvider from "./components/GoogleTranslateProvider";
import TransitionProvider from "./components/TransitionProvider";
import { createClient } from "@/lib/supabase/server";

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "Palm Springs",
  description: "Palm Springs — เลือกปาล์มสปริงส์ เพื่อชีวิตที่ดีกว่า",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Fetch sticky contact settings (non-blocking — graceful fallback on error)
  let stickySettings: { facebook_messenger_url?: string; line_url?: string } = {};
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("site_settings")
      .select("value")
      .eq("key", "sticky_contact")
      .single();
    if (data?.value) stickySettings = data.value as typeof stickySettings;
  } catch {
    // use defaults
  }

  return (
    <html lang="th">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+Thai:wght@100..900&display=swap" rel="stylesheet" />
      </head>
      <body className={`${montserrat.variable} antialiased`}>
        <GoogleTranslateProvider />
        <TransitionProvider>
          {children}
        </TransitionProvider>
        <PublicStickyContact
          facebookMessengerUrl={stickySettings.facebook_messenger_url}
          lineUrl={stickySettings.line_url}
        />
      </body>
    </html>
  );
}
