import { locales, type Locale } from "@/lib/site-content"

// AGENCY_OWNED: routing helpers for localized navigation.
export type LocalizedSection = "about" | "packages" | "services"

export function localizedSectionHref(locale: Locale, section: LocalizedSection) {
  return `/${locale}/${section}`
}

export function resolveLocalePath(pathname: string, nextLocale: Locale) {
  if (!pathname || pathname === "/") {
    return "/"
  }

  const segments = pathname.split("/").filter(Boolean)
  if (segments.length === 0) {
    return "/"
  }

  const [firstSegment] = segments

  if (locales.includes(firstSegment as Locale)) {
    segments[0] = nextLocale
    return `/${segments.join("/")}`
  }

  if (firstSegment === "about" || firstSegment === "packages" || firstSegment === "services") {
    return `/${nextLocale}/${firstSegment}`
  }

  return pathname
}
