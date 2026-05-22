// lib/llms/content.ts
// Pure string builders for /llms.txt and /llms-full.txt. No I/O.
import { SITE_NAME, SITE_SUMMARY, SITE_URL, STATIC_PAGES } from "./site";
import type { LlmsProject, LlmsPost } from "./data";
import { htmlToMarkdown } from "./markdown";

/** First non-empty line of a multi-line string, trimmed. */
function firstLine(text: string | null): string {
  if (!text) return "";
  return text.split("\n").map((l) => l.trim()).find((l) => l.length > 0) ?? "";
}

/** Collapse newlines/whitespace and escape "]" so a value is safe inside a
 *  single Markdown line (link text, list item, or "## heading"). */
function inline(text: string): string {
  return text.replace(/\s+/g, " ").trim().replace(/]/g, "\\]");
}

function header(): string {
  return `# ${SITE_NAME}\n\n> ${SITE_SUMMARY}\n`;
}

/** A "## Heading" section from pre-rendered lines; returns "" if no lines. */
function section(heading: string, lines: string[]): string {
  if (lines.length === 0) return "";
  return `\n## ${heading}\n\n${lines.join("\n")}\n`;
}

/** Render a single index-list line for a blog/CSR post. */
function postLine(p: LlmsPost): string {
  const suffix = p.excerpt ? `: ${inline(p.excerpt)}` : "";
  return `- [${inline(p.title)}](${SITE_URL}/blog/${p.slug})${suffix}`;
}

export function buildLlmsIndex(
  projects: LlmsProject[],
  posts: LlmsPost[],
): string {
  const blog = posts.filter((p) => p.type !== "csr");
  const csr = posts.filter((p) => p.type === "csr");

  const mainLines = STATIC_PAGES.map(
    (p) => `- [${inline(p.description)}](${SITE_URL}${p.path})`,
  );
  const projectLines = projects.map((p) => {
    const desc = p.subtitle?.trim() || firstLine(p.description);
    const suffix = desc ? `: ${inline(desc)}` : "";
    return `- [${inline(p.name)}](${SITE_URL}/projects/${p.slug})${suffix}`;
  });
  const blogLines = blog.map(postLine);
  const csrLines = csr.map(postLine);

  return (
    header() +
    section("Main Pages / หน้าหลัก", mainLines) +
    section("Projects / โครงการ", projectLines) +
    section("Blog & News / บทความและข่าวสาร", blogLines) +
    section("CSR", csrLines)
  );
}

export function buildLlmsFull(
  projects: LlmsProject[],
  posts: LlmsPost[],
): string {
  const projectBlocks = projects.map((p) => {
    const parts = [`## ${inline(p.name)}`, `URL: ${SITE_URL}/projects/${p.slug}`];
    if (p.subtitle?.trim()) parts.push(`_${inline(p.subtitle.trim())}_`);
    if (p.description?.trim()) parts.push(p.description.trim());
    if (p.highlights.length > 0) {
      parts.push(
        "**Highlights:**\n" + p.highlights.map((h) => `- ${h}`).join("\n"),
      );
    }
    if (p.houseTypes.length > 0) {
      parts.push(
        "**House types / แบบบ้าน:**\n" + p.houseTypes.map((h) => `- ${h}`).join("\n"),
      );
    }
    if (p.nearbyPlaces.length > 0) {
      parts.push(
        "**Nearby / สถานที่ใกล้เคียง:**\n" + p.nearbyPlaces.map((n) => `- ${n}`).join("\n"),
      );
    }
    return parts.join("\n\n");
  });

  const postBlocks = posts.map((p) => {
    const parts = [`## ${inline(p.title)}`, `URL: ${SITE_URL}/blog/${p.slug}`];
    if (p.publishedAt) parts.push(`Published: ${p.publishedAt}`);
    if (p.excerpt?.trim()) parts.push(p.excerpt.trim());
    const body = htmlToMarkdown(p.content);
    if (body) parts.push(body);
    return parts.join("\n\n");
  });

  const projectsSection =
    projectBlocks.length > 0
      ? `\n## Projects / โครงการ\n\n${projectBlocks.join("\n\n---\n\n")}\n`
      : "";
  const postsSection =
    postBlocks.length > 0
      ? `\n## Blog & News / บทความและข่าวสาร\n\n${postBlocks.join("\n\n---\n\n")}\n`
      : "";

  return header() + projectsSection + postsSection;
}
