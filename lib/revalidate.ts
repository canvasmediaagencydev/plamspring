/**
 * Trigger Next.js cache revalidation for the given paths.
 * Call this from admin client components after a successful save.
 */
export async function revalidatePages(paths: string[] = ["/"]) {
  try {
    await fetch("/api/admin/revalidate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ paths }),
    });
  } catch {
    // Non-blocking — revalidation failure doesn't break the save flow
    console.warn("Revalidation failed");
  }
}

/** Common path sets for each content type */
export const REVALIDATE_PATHS = {
  home: ["/"],
  footer: ["/", "/about", "/blog", "/our-family"],
  about: ["/about"],
  ourFamily: ["/our-family"],
  posts: ["/blog", "/about"],
} as const;
