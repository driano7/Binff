import type React from "react"
import type { Metadata } from "next"
import { Fraunces, Inter } from "next/font/google"

import { SiteFooter } from "@/components/core/site-footer"
import { SiteHeader } from "@/components/core/site-header"
import { SiteParticleBackground } from "@/components/core/site-particle-background"
import { Seo } from "@/components/seo/Seo"
import { ThemeProvider } from "@/components/core/theme-provider"
import { getLocaleFromCookies } from "@/lib/locale"
import {
  buildLayoutMetadata,
  buildOrganizationEntity,
  buildWebSiteEntity,
  seoConfig,
} from "@/lib/seo"
import { getThemeFromRequest } from "@/lib/theme"
import "./globals.css"

// AGENCY_OWNED: root shell wiring for SEO, theme, locale, and global chrome.
// Client-specific copy/assets flow through the site-content and page components below.
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
  ...buildLayoutMetadata(seoConfig, {
    defaultTitle: seoConfig.site.defaultTitle,
    description: seoConfig.site.defaultDescription,
    canonicalPath: "/",
  }),
  applicationName: seoConfig.brand.brandName,
  keywords: [
    "web development",
    "sites web",
    "SEO técnico",
    "posicionamiento orgánico",
    "agencia web",
  ],
  authors: [{ name: seoConfig.brand.brandName, url: seoConfig.brand.brandUrl }],
  creator: seoConfig.brand.brandName,
  publisher: seoConfig.brand.brandName,
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
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const locale = await getLocaleFromCookies()
  const theme = await getThemeFromRequest()
  const organizationJsonLd = buildOrganizationEntity(seoConfig)
  const websiteJsonLd = buildWebSiteEntity(seoConfig, {
    searchTarget: `${seoConfig.site.siteUrl}/blog?q={search_term_string}`,
  })

  return (
    <html lang={locale} className={`${fraunces.variable} ${inter.variable} ${theme === "dark" ? "dark" : ""}`} suppressHydrationWarning>
      <body className="relative isolate bg-background text-foreground antialiased">
        <Seo entities={[organizationJsonLd, websiteJsonLd]} />
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
