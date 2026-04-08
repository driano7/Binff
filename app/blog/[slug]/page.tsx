import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowUpRight } from "lucide-react"
import type { Metadata } from "next"

import { HeadingTypewriter } from "@/components/core/heading-typewriter"
import { BlogArticle } from "@/components/core/blog-article"
import { Seo } from "@/components/seo/Seo"
import { ScrollReveal } from "@/components/core/scroll-reveal"
import { Button } from "@/components/ui/button"
import { getLocaleFromCookies } from "@/lib/locale"
import { getBlogPostBySlug, getAllBlogPosts, renderMdxToHtml } from "@/lib/blog"
import {
  buildArticleEntity,
  buildBreadcrumbList,
  buildPageMetadata,
  seoConfig,
} from "@/lib/seo"

type PageProps = {
  params: {
    slug: string
  }
}

export function generateStaticParams() {
  return getAllBlogPosts().map((post) => ({ slug: post.slug }))
}

export function generateMetadata({ params }: PageProps): Metadata {
  const post = getBlogPostBySlug(params.slug)

  if (!post) {
    return buildPageMetadata(seoConfig, {
      title: seoConfig.brand.brandName,
      description: seoConfig.brand.brandDescription,
      canonicalPath: `/blog/${params.slug}`,
    })
  }

  return buildPageMetadata(seoConfig, {
    title: post.title,
    description: post.excerpt,
    canonicalPath: `/blog/${post.slug}`,
    openGraph: {
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
    },
  })
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = params
  const locale = await getLocaleFromCookies()
  const post = getBlogPostBySlug(slug, locale)

  if (!post) notFound()

  const html = renderMdxToHtml(post.content)
  const ctaClassName = "rounded-full bg-[color:var(--foreground)] px-5 text-sm font-semibold text-white hover:bg-[color:var(--foreground)]/90 dark:text-black"
  const entities = [
    buildArticleEntity(seoConfig, {
      kind: "BlogPosting",
      slug: post.slug,
      headline: post.title,
      description: post.excerpt,
      datePublished: post.date,
      articleSection: post.category,
      inLanguage: locale,
    }),
    buildBreadcrumbList(
      [
        { name: "Inicio", path: "/" },
        { name: "Blog", path: "/blog" },
        { name: post.title, path: `/blog/${post.slug}` },
      ],
      seoConfig,
    ),
  ]

  return (
    <main id="blog-post-scope" className="mx-auto w-full max-w-4xl px-4 pb-8 pt-28 sm:px-6 lg:pt-32">
      <Seo entities={entities} />
      <HeadingTypewriter scopeSelector="#blog-post-scope" />

      <section className="space-y-8">
        <ScrollReveal direction="up">
          <BlogArticle title={post.title} excerpt={post.excerpt} html={html} />
        </ScrollReveal>

        <div className="space-y-5 text-center">
          <div className="flex flex-wrap justify-center gap-3 text-xs font-semibold uppercase tracking-[0.25em] text-[color:var(--accent)]">
            <span>{post.category}</span>
            <span>{post.date}</span>
            <span>{post.readTime}</span>
          </div>
          <div className="flex flex-wrap justify-center gap-3">
            <Button asChild className={ctaClassName}>
              <Link href="/blog">
                Back to blog
                <ArrowUpRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </main>
  )
}
