// Blog content loader — single source of truth for the pages AND
// scripts/sync-standard.ts. No `server-only` import here: the sync script
// runs outside a Next build and would throw on it.
import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { markdownToHtml } from "./markdown";

const BLOG_DIR = path.join(process.cwd(), "content", "blog");

export type PostMeta = {
  slug: string;
  title: string;
  description: string;
  date: string;
  /** ISO timestamp derived from `date`; drives sorting and record publishedAt. */
  publishedAt: string;
  tags: string[];
};

export type Post = PostMeta & { html: string };

/**
 * The slug doubles as URL segment and atproto record rkey, so it must stay
 * within the rkey grammar: `[a-zA-Z0-9._~:-]`, 1–512 chars, never `.`/`..`.
 */
export function sanitizeSlug(raw: string): string {
  const slug = raw
    .trim()
    .replace(/[^a-zA-Z0-9._~:-]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 512);
  if (!slug || slug === "." || slug === "..") {
    throw new Error(`Cannot derive a valid slug/rkey from "${raw}"`);
  }
  return slug;
}

function postFiles(): string[] {
  if (!fs.existsSync(BLOG_DIR)) return [];
  return fs.readdirSync(BLOG_DIR).filter((f) => f.endsWith(".md"));
}

function parseFile(file: string): { meta: PostMeta; markdown: string } {
  const raw = fs.readFileSync(path.join(BLOG_DIR, file), "utf8");
  const { data, content } = matter(raw);

  const slug = sanitizeSlug(
    typeof data.slug === "string" ? data.slug : file.replace(/\.md$/, ""),
  );

  // gray-matter parses unquoted YAML dates into Date objects.
  const date =
    data.date instanceof Date ? data.date.toISOString() : String(data.date ?? "");
  const parsed = new Date(date);
  if (Number.isNaN(parsed.getTime())) {
    throw new Error(`Unparseable date "${data.date}" in content/blog/${file}`);
  }

  return {
    meta: {
      slug,
      title: typeof data.title === "string" ? data.title : slug,
      description: typeof data.description === "string" ? data.description : "",
      date,
      publishedAt: parsed.toISOString(),
      tags: Array.isArray(data.tags) ? data.tags.map(String) : [],
    },
    markdown: content,
  };
}

export function getAllPostMeta(): PostMeta[] {
  return postFiles()
    .map((f) => parseFile(f).meta)
    .sort((a, b) => (a.publishedAt < b.publishedAt ? 1 : -1));
}

export function getAllSlugs(): string[] {
  return getAllPostMeta().map((p) => p.slug);
}

export async function getPost(slug: string): Promise<Post | null> {
  for (const file of postFiles()) {
    const { meta, markdown } = parseFile(file);
    if (meta.slug === slug) {
      return { ...meta, html: await markdownToHtml(markdown) };
    }
  }
  return null;
}
