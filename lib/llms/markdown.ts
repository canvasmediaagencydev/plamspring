// lib/llms/markdown.ts
// Converts blog post HTML (from the Tiptap editor) into clean Markdown for llms-full.txt.
import TurndownService from "turndown";

const turndown = new TurndownService({
  headingStyle: "atx",
  codeBlockStyle: "fenced",
  bulletListMarker: "-",
});

/** Convert an HTML string to Markdown. Returns "" for empty/nullish input. */
export function htmlToMarkdown(html: string | null | undefined): string {
  if (!html) return "";
  return turndown.turndown(html).trim();
}
