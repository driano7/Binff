import Link from "next/link"
import { ArrowUpRight } from "lucide-react"
import type { Metadata } from "next"
import { notFound } from "next/navigation"

import { HeadingTypewriter } from "@/components/core/heading-typewriter"
import { BlogArticle } from "@/components/core/blog-article"
import { ScrollReveal } from "@/components/core/scroll-reveal"
import { Button } from "@/components/ui/button"
import { getSiteCopy, locales, type Locale } from "@/lib/site-content"
import { readLocalizedMdx, renderMdxToHtml } from "@/lib/mdx"
import { localizedBlogHref } from "@/lib/navigation"
import { buildPageMetadata, seoConfig } from "@/lib/seo"

const blogSurfaces = [
  "from-accent/20 via-background to-primary/10",
  "from-sky-400/20 via-background to-accent/15",
  "from-emerald-400/20 via-background to-accent/15",
] as const

type LocalePageProps = {
  params: Promise<{
    locale: string
  }>
}

function buildBlogAlternates() {
  return {
    languages: Object.fromEntries(locales.map((item) => [item, `/${item}/blog`])) as Record<string, string>,
  }
}

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }))
}

export async function generateMetadata({ params }: LocalePageProps): Promise<Metadata> {
  const { locale } = await params

  if (!locales.includes(locale as Locale)) {
    return buildPageMetadata(seoConfig, {
      title: `${seoConfig.brand.brandName} Studio`,
      description: seoConfig.brand.brandDescription,
      canonicalPath: "/blog",
    })
  }

  const doc = readLocalizedMdx("blog", locale as Locale) ?? readLocalizedMdx("blog", "en")

  if (!doc) {
    return buildPageMetadata(seoConfig, {
      title: `${seoConfig.brand.brandName} Studio`,
      description: seoConfig.brand.brandDescription,
      canonicalPath: `/${locale}/blog`,
    })
  }

  return buildPageMetadata(seoConfig, {
    title: doc.title,
    description: doc.excerpt,
    canonicalPath: `/${locale}/blog`,
    locale,
    alternates: buildBlogAlternates(),
  })
}

export default async function BlogPage({ params }: LocalePageProps) {
  const { locale } = await params

  if (!locales.includes(locale as Locale)) {
    notFound()
  }

  const typedLocale = locale as Locale
  const copy = getSiteCopy(typedLocale)
  const doc = readLocalizedMdx("blog", typedLocale) ?? readLocalizedMdx("blog", "en")
  const posts = copy.blog.cards

  if (!doc) return null

  return (
    <main id="blog-scope" className="mx-auto w-full max-w-6xl px-4 pb-8 pt-28 sm:px-6 lg:pt-32">
      <HeadingTypewriter scopeSelector="#blog-scope" />

      <ScrollReveal direction="up">
        <BlogArticle title={doc.title} excerpt={doc.excerpt} html={renderMdxToHtml(doc.content)} />
      </ScrollReveal>

      <section className="mt-8 grid gap-4 md:grid-cols-2">
        {posts.map((post, index) => (
          <ScrollReveal key={post.slug} direction={index % 2 === 0 ? "up" : "down"} delay={0.08 + index * 0.08}>
            <article className="rounded-[2rem] border border-border/70 bg-card/75 p-3 shadow-[0_10px_35px_-24px_rgba(2,6,23,0.55)] transition">
              <div className={`relative h-full overflow-hidden rounded-[1.4rem] border border-border/70 bg-gradient-to-br p-5 ${blogSurfaces[index % blogSurfaces.length]}`}>
                <div className="absolute -right-8 -top-8 h-20 w-20 rounded-full bg-accent/20 blur-xl" />
                <div className="absolute -bottom-8 -left-8 h-20 w-20 rounded-full bg-primary/20 blur-xl" />
                <div className="relative space-y-3">
                  <span className="inline-flex rounded-full border border-border/70 bg-background/75 px-2.5 py-1 text-[11px] font-semibold text-muted-foreground">
                    {post.tag}
                  </span>
                  <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">{post.title}</h2>
                  <p className="text-sm leading-relaxed text-muted-foreground">{post.excerpt}</p>
                  <Link
                    href={localizedBlogHref(typedLocale, post.slug)}
                    className="inline-flex items-center gap-2 pt-2 text-sm font-semibold text-[color:var(--accent)] hover:underline"
                  >
                    {typedLocale === "es" ? "Leer artículo" : typedLocale === "fr" ? "Lire l’article" : "Read article"}
                    <ArrowUpRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            </article>
          </ScrollReveal>
        ))}
      </section>

      <div className="mt-6 flex justify-start">
        <Button asChild variant="outline" className="rounded-full border-border/60 bg-card/80 px-5 text-sm font-semibold text-card-foreground hover:bg-card dark:bg-card/70">
          <Link href="/#contact">{copy.nav.contact}</Link>
        </Button>
      </div>
    </main>
  )
}
