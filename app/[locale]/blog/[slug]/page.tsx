import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowUpRight } from "lucide-react"
import type { Metadata } from "next"

import { HeadingTypewriter } from "@/components/core/heading-typewriter"
import { BlogArticle } from "@/components/core/blog-article"
import { JsonLd } from "@/components/seo/JsonLd"
import { Seo } from "@/components/seo/Seo"
import { ScrollReveal } from "@/components/core/scroll-reveal"
import { Button } from "@/components/ui/button"
import { getBlogPostBySlug, getAllBlogPosts, renderMdxToHtml } from "@/lib/blog"
import { getSiteCopy, locales, type Locale } from "@/lib/site-content"
import { localizedBlogHref } from "@/lib/navigation"
import {
  buildArticleEntity,
  buildBreadcrumbList,
  buildFaqPageEntity,
  buildPageMetadata,
  seoConfig,
  buildCanonicalUrl,
} from "@/lib/seo"

type PageProps = {
  params: Promise<{
    locale: string
    slug: string
  }>
}

function buildBlogLanguageAlternates(slug: string) {
  return {
    languages: Object.fromEntries(locales.map((item) => [item, `/${item}/blog/${slug}`])) as Record<string, string>,
  }
}

function getCardRevealDirection(index: number) {
  return index % 2 === 0 ? "up" : "down"
}

const blogPanelCopy = {
  en: {
    panelTitle: "SEO + LLM",
    summary: "Summary",
    semanticKeywords: "Semantic keywords",
    entities: "Entities",
    semanticRelations: "Semantic relations",
    takeaway: "Snippet-ready takeaway",
    faq: "FAQ",
    visibleQuestions: "Visible questions",
    internalLinks: "Internal links",
  },
  es: {
    panelTitle: "SEO + IA",
    summary: "Resumen",
    semanticKeywords: "Palabras clave semánticas",
    entities: "Entidades",
    semanticRelations: "Relaciones semánticas",
    takeaway: "Idea clave para snippet",
    faq: "Preguntas frecuentes",
    visibleQuestions: "Preguntas visibles",
    internalLinks: "Enlaces internos",
  },
  fr: {
    panelTitle: "SEO + IA",
    summary: "Résumé",
    semanticKeywords: "Mots-clés sémantiques",
    entities: "Entités",
    semanticRelations: "Relations sémantiques",
    takeaway: "Point clé pour extrait",
    faq: "FAQ",
    visibleQuestions: "Questions visibles",
    internalLinks: "Liens internes",
  },
} as const

export function generateStaticParams() {
  return locales.flatMap((locale) =>
    getAllBlogPosts().map((post) => ({
      locale,
      slug: post.slug,
    })),
  )
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale, slug } = await params

  if (!locales.includes(locale as Locale)) {
    return buildPageMetadata(seoConfig, {
      title: `${seoConfig.brand.brandName} Studio`,
      description: seoConfig.brand.brandDescription,
      canonicalPath: `/blog/${slug}`,
      locale,
    })
  }

  const post = getBlogPostBySlug(slug, locale as Locale)

  if (!post) {
    return buildPageMetadata(seoConfig, {
      title: `${seoConfig.brand.brandName} Studio`,
      description: seoConfig.brand.brandDescription,
      canonicalPath: `/${locale}/blog/${slug}`,
      locale,
    })
  }

  return buildPageMetadata(seoConfig, {
    title: post.title,
    description: post.excerpt,
    canonicalPath: `/${locale}/blog/${post.slug}`,
    locale,
    alternates: buildBlogLanguageAlternates(post.slug),
    openGraph: {
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
    },
  })
}

export default async function BlogPostPage({ params }: PageProps) {
  const { locale, slug } = await params

  if (!locales.includes(locale as Locale)) {
    notFound()
  }

  const typedLocale = locale as Locale
  const copy = getSiteCopy(typedLocale)
  const post = getBlogPostBySlug(slug, typedLocale)

  if (!post) notFound()

  const html = renderMdxToHtml(post.content)
  const ctaClassName = "rounded-full bg-[color:var(--foreground)] px-5 text-sm font-semibold text-white hover:bg-[color:var(--foreground)]/90 dark:text-black"
  const semanticKeywords = post.secondaryKeywords ?? []
  const semanticEntities = post.entities ?? []
  const relations = post.semanticRelations ?? []
  const faqItems = post.faq ?? []
  const internalLinks = post.internalLinks ?? []
  const panelCopy = blogPanelCopy[typedLocale]
  const hasSeoLlmPanel =
    Boolean(post.primaryKeyword || post.searchIntent || post.llmSummary || post.snippetTakeaway) ||
    semanticKeywords.length > 0 ||
    semanticEntities.length > 0 ||
    relations.length > 0 ||
    faqItems.length > 0 ||
    internalLinks.length > 0
  const structuredData = [
    buildArticleEntity(seoConfig, {
      kind: "BlogPosting",
      slug: post.slug,
      headline: post.title,
      description: post.excerpt,
      datePublished: post.date,
      articleSection: post.category,
      inLanguage: typedLocale,
      url: buildCanonicalUrl(seoConfig, `/${typedLocale}/blog/${post.slug}`),
    }),
    buildBreadcrumbList(
      [
        { name: copy.nav.home, path: "/" },
        { name: copy.nav.blog, path: `/${typedLocale}/blog` },
        { name: post.title, path: `/${typedLocale}/blog/${post.slug}` },
      ],
      seoConfig,
    ),
  ]

  return (
    <main id="blog-post-scope" className="mx-auto w-full max-w-4xl px-4 pb-8 pt-28 sm:px-6 lg:pt-32">
      <Seo entities={structuredData} />
      {faqItems.length > 0 ? <JsonLd data={buildFaqPageEntity({ questions: faqItems })} /> : null}
      <HeadingTypewriter scopeSelector="#blog-post-scope" />

      <section className="space-y-8">
        <ScrollReveal direction="up">
          <BlogArticle title={post.title} excerpt={post.excerpt} html={html} />
        </ScrollReveal>

        {hasSeoLlmPanel ? (
          <ScrollReveal direction="up" className="mt-2">
            <section className="rounded-[2rem] border border-border/60 bg-card/80 p-5 text-card-foreground shadow-[0_18px_55px_-28px_rgba(2,6,23,0.35)] dark:bg-card/70 md:p-6">
              <div className="max-w-3xl space-y-3">
                <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[color:var(--accent)]">
                  {panelCopy.panelTitle}
                </p>
                <h2 className="text-2xl font-semibold tracking-tight text-card-foreground md:text-3xl">
                  {post.primaryKeyword ?? post.title}
                </h2>
                <p className="text-sm leading-7 text-muted-foreground md:text-base">
                  {post.searchIntent ?? post.llmSummary ?? post.excerpt}
                </p>
              </div>

              <div className="mt-6 grid gap-4 lg:grid-cols-[1.05fr_0.95fr]">
                <div className="space-y-4">
                  {post.llmSummary ? (
                    <ScrollReveal direction={getCardRevealDirection(0)} delay={0.04}>
                      <article className="rounded-[1.6rem] border border-border/60 bg-background/75 p-4">
                        <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-muted-foreground">{panelCopy.summary}</p>
                        <p className="mt-3 text-sm leading-7 text-foreground">{post.llmSummary}</p>
                      </article>
                    </ScrollReveal>
                  ) : null}

                  {semanticKeywords.length > 0 ? (
                    <ScrollReveal direction={getCardRevealDirection(1)} delay={0.08}>
                      <article className="rounded-[1.6rem] border border-border/60 bg-background/75 p-4">
                        <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-muted-foreground">{panelCopy.semanticKeywords}</p>
                        <div className="mt-4 flex flex-wrap gap-2">
                          {semanticKeywords.map((keyword) => (
                            <span key={keyword} className="rounded-full border border-border/60 bg-card/80 px-3 py-1 text-xs font-medium text-foreground">
                              {keyword}
                            </span>
                          ))}
                        </div>
                      </article>
                    </ScrollReveal>
                  ) : null}

                  {semanticEntities.length > 0 ? (
                    <ScrollReveal direction={getCardRevealDirection(2)} delay={0.12}>
                      <article className="rounded-[1.6rem] border border-border/60 bg-background/75 p-4">
                        <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-muted-foreground">{panelCopy.entities}</p>
                        <ul className="mt-4 space-y-2 text-sm text-foreground">
                          {semanticEntities.map((entity) => (
                            <li key={entity} className="flex gap-2">
                              <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[color:var(--accent)]" />
                              <span>{entity}</span>
                            </li>
                          ))}
                        </ul>
                      </article>
                    </ScrollReveal>
                  ) : null}

                  {relations.length > 0 ? (
                    <ScrollReveal direction={getCardRevealDirection(3)} delay={0.16}>
                      <article className="rounded-[1.6rem] border border-border/60 bg-background/75 p-4">
                        <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-muted-foreground">{panelCopy.semanticRelations}</p>
                        <ul className="mt-4 space-y-2 text-sm text-foreground">
                          {relations.map((relation) => (
                            <li key={relation} className="flex gap-2">
                              <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[color:var(--accent)]" />
                              <span>{relation}</span>
                            </li>
                          ))}
                        </ul>
                      </article>
                    </ScrollReveal>
                  ) : null}
                </div>

                <div className="space-y-4">
                  {post.snippetTakeaway ? (
                    <ScrollReveal direction={getCardRevealDirection(4)} delay={0.2}>
                      <article className="rounded-[1.6rem] border border-border/60 bg-background/75 p-4">
                        <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-muted-foreground">{panelCopy.takeaway}</p>
                        <blockquote className="mt-3 rounded-2xl border border-border/60 bg-card/80 p-4 text-sm leading-7 text-foreground">
                          <span className="underline decoration-[color:var(--accent)] decoration-2 underline-offset-4">
                            {post.snippetTakeaway}
                          </span>
                        </blockquote>
                      </article>
                    </ScrollReveal>
                  ) : null}

                  {faqItems.length > 0 ? (
                    <ScrollReveal direction={getCardRevealDirection(5)} delay={0.24}>
                      <article className="rounded-[1.6rem] border border-border/60 bg-background/75 p-4">
                        <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-muted-foreground">{panelCopy.faq}</p>
                        <h3 className="mt-2 text-lg font-semibold tracking-tight text-foreground">{panelCopy.visibleQuestions}</h3>
                        <div className="mt-4 space-y-4">
                          {faqItems.map((faq, index) => (
                            <ScrollReveal key={faq.question} direction={getCardRevealDirection(index)} delay={0.08 + index * 0.08} once>
                              <div className="rounded-2xl border border-border/60 bg-card/80 p-4">
                                <p className="text-sm font-semibold text-foreground">{faq.question}</p>
                                <p className="mt-2 text-sm leading-6 text-muted-foreground">{faq.answer}</p>
                              </div>
                            </ScrollReveal>
                          ))}
                        </div>
                      </article>
                    </ScrollReveal>
                  ) : null}

                  {internalLinks.length > 0 ? (
                    <ScrollReveal direction={getCardRevealDirection(6)} delay={0.28}>
                      <article className="rounded-[1.6rem] border border-border/60 bg-background/75 p-4">
                        <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-muted-foreground">{panelCopy.internalLinks}</p>
                        <div className="mt-4 space-y-3 text-sm text-foreground">
                          {internalLinks.map((linkItem, index) => (
                            <ScrollReveal key={`${linkItem.label}-${linkItem.href}`} direction={getCardRevealDirection(index)} delay={0.08 + index * 0.08} once>
                              <div className="rounded-2xl border border-border/60 bg-card/80 p-4">
                                <Link href={linkItem.href} className="font-semibold text-[color:var(--accent)] hover:underline">
                                  {linkItem.label}
                                </Link>
                                <p className="mt-2 text-sm leading-6 text-muted-foreground">{linkItem.purpose}</p>
                              </div>
                            </ScrollReveal>
                          ))}
                        </div>
                      </article>
                    </ScrollReveal>
                  ) : null}
                </div>
              </div>
            </section>
          </ScrollReveal>
        ) : null}

        <div className="space-y-5 text-center">
          <div className="flex flex-wrap justify-center gap-3 text-xs font-semibold uppercase tracking-[0.25em] text-[color:var(--accent)]">
            <span>{post.category}</span>
            <span>{post.date}</span>
            <span>{post.readTime}</span>
          </div>
          <div className="flex flex-wrap justify-center gap-3">
            <Button asChild className={ctaClassName}>
              <Link href={localizedBlogHref(typedLocale)}>
                {typedLocale === "es" ? "Volver al blog" : typedLocale === "fr" ? "Retour au blog" : "Back to blog"}
                <ArrowUpRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </main>
  )
}
