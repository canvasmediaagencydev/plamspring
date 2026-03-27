"use client";

import { usePathname } from "next/navigation";
import StickyContact from "./StickyContact";

interface PublicStickyContactProps {
  facebookMessengerUrl?: string;
  lineUrl?: string;
}

/** Renders StickyContact only on non-admin pages. */
export default function PublicStickyContact(props: PublicStickyContactProps) {
  const pathname = usePathname();
  if (pathname.startsWith("/admin")) return null;
  return <StickyContact {...props} />;
}
