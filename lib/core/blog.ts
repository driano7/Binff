import fs from "node:fs"
import path from "node:path"

export { renderMdxToHtml } from "@/lib/core/mdx"
import { parseFrontmatter } from "@/lib/core/mdx"
import type { Locale } from "@/lib/site-content"

// AGENCY_OWNED: reusable metadata types and blog loading helpers.
export type BlogMeta = {
  slug: string
  title: string
  excerpt: string
  date: string
  readTime: string
  category: string
  tags: string[]
}

export type BlogPost = BlogMeta & {
  content: string
}

const BLOG_DIR = path.join(process.cwd(), "content", "blog")

// CLIENTE_OWNED: blog posts themselves live under content/ and are editorial assets.
function getLocalizedBlogFilePath(slug: string, locale?: Locale) {
  if (locale && locale !== "en") {
    return path.join(BLOG_DIR, locale, `${slug}.mdx`)
  }

  return path.join(BLOG_DIR, `${slug}.mdx`)
}

export function getAllBlogPosts(): BlogMeta[] {
  if (!fs.existsSync(BLOG_DIR)) return []

  return fs
    .readdirSync(BLOG_DIR)
    .filter((file) => file.endsWith(".mdx"))
    .map((file) => getBlogPostBySlug(file.replace(/\.mdx$/, "")))
    .filter((post): post is BlogMeta => Boolean(post))
    .sort((a, b) => (a.date < b.date ? 1 : -1))
}

export function getBlogPostBySlug(slug: string, locale?: Locale): BlogPost | null {
  const localizedPath = getLocalizedBlogFilePath(slug, locale)
  const filePath = fs.existsSync(localizedPath) ? localizedPath : path.join(BLOG_DIR, `${slug}.mdx`)
  if (!fs.existsSync(filePath)) return null

  const raw = fs.readFileSync(filePath, "utf8")
  const { meta, body } = parseFrontmatter(raw)

  if (!meta.slug || !meta.title || !meta.excerpt || !meta.date || !meta.readTime || !meta.category) {
    return null
  }

  return {
    slug: meta.slug,
    title: meta.title,
    excerpt: meta.excerpt,
    date: meta.date,
    readTime: meta.readTime,
    category: meta.category,
    tags: meta.tags ?? [],
    content: body,
  }
}
