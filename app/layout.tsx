import type React from "react"
import type { Metadata } from "next"
import { Fraunces, Inter } from "next/font/google"

import { SiteFooter } from "@/components/site-footer"
import { SiteHeader } from "@/components/site-header"
import { SiteParticleBackground } from "@/components/site-particle-background"
import { ThemeProvider } from "@/components/theme-provider"
import { getLocaleFromCookies } from "@/lib/locale"
import { getMetadataBaseUrl, getSiteUrl, SITE_DESCRIPTION, SITE_NAME, SOCIAL_LINKS } from "@/lib/seo"
import { getThemeFromRequest } from "@/lib/theme"
import "./globals.css"

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  display: "swap",
})

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
})

const verificationOther: Record<string, string> = {}
if (process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION) {
  verificationOther.google = process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION
}
if (process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION) {
  verificationOther["msvalidate.01"] = process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION
}
if (process.env.NEXT_PUBLIC_FACEBOOK_DOMAIN_VERIFICATION) {
  verificationOther["facebook-domain-verification"] = process.env.NEXT_PUBLIC_FACEBOOK_DOMAIN_VERIFICATION
}

export const metadata: Metadata = {
  metadataBase: getMetadataBaseUrl(),
  title: {
    default: SITE_NAME,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  applicationName: SITE_NAME,
  keywords: [
    "web development Mexico Canada",
    "bilingual websites",
    "mobile apps",
    "UX UI",
    "AI consulting",
    "Web3",
    "crypto integrations",
    "SEO",
  ],
  authors: [{ name: SITE_NAME, url: "/" }],
  creator: SITE_NAME,
  publisher: SITE_NAME,
  alternates: {
    canonical: "/",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION || undefined,
    other: verificationOther,
  },
  icons: {
    icon: [
      {
        url: "/icon",
        media: "(prefers-color-scheme: light)",
      },
      {
        url: "/icon",
        media: "(prefers-color-scheme: dark)",
      },
    ],
    apple: "/apple-icon",
  },
  openGraph: {
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
    url: "/",
    siteName: SITE_NAME,
    type: "website",
    locale: "en_US",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: `${SITE_NAME} logo preview`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
    images: ["/opengraph-image"],
  },
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const locale = await getLocaleFromCookies()
  const theme = await getThemeFromRequest()
  const siteUrl = getSiteUrl()
  const organizationJsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE_NAME,
    url: siteUrl,
    logo: `${siteUrl}/apple-icon`,
    sameAs: SOCIAL_LINKS,
    description: SITE_DESCRIPTION,
  }

  const websiteJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_NAME,
    url: siteUrl,
    inLanguage: "en",
    potentialAction: {
      "@type": "SearchAction",
      target: `${siteUrl}/blog?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  }

  return (
    <html lang={locale} className={`${fraunces.variable} ${inter.variable} ${theme === "dark" ? "dark" : ""}`} suppressHydrationWarning>
      <body className="relative isolate bg-background text-foreground antialiased">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }} />
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
          <SiteParticleBackground theme={theme} />
          <SiteHeader locale={locale} />
          {children}
          <SiteFooter locale={locale} />
        </ThemeProvider>
      </body>
    </html>
  )
}
