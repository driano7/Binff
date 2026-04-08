import { cookies, headers } from "next/headers"

import { locales, type Locale } from "@/lib/site-content"

// AGENCY_OWNED: locale resolution logic is reusable across the app shell.
export async function getLocaleFromCookies(): Promise<Locale> {
  const cookieStore = await cookies()
  const cookieLocale = cookieStore.get("NEXT_LOCALE")?.value
  if (locales.includes(cookieLocale as Locale)) {
    return cookieLocale as Locale
  }

  const acceptLanguage = (await headers()).get("accept-language") ?? ""
  const preferredLocales = acceptLanguage
    .split(",")
    .map((part) => part.split(";")[0]?.trim().toLowerCase())
    .filter(Boolean)

  for (const preferred of preferredLocales) {
    const base = preferred.split("-")[0] as Locale
    if (locales.includes(base)) {
      return base
    }
  }

  return "es"
}
