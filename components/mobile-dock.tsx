"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { BookOpenText, BriefcaseBusiness, Menu, PanelsTopLeft, PocketKnife, UserRound } from "lucide-react"

import { localizedSectionHref } from "@/lib/navigation"
import { cn } from "@/lib/utils"
import type { Locale } from "@/lib/site-content"

type MobileDockProps = {
  locale: Locale
  aboutLabel: string
  packagesLabel: string
  portfolioLabel: string
  blogLabel: string
  servicesLabel: string
}

type DockItem = {
  href: string
  label: string
  icon: typeof Home
}

export function MobileDock({
  locale,
  aboutLabel,
  packagesLabel,
  portfolioLabel,
  blogLabel,
  servicesLabel,
}: MobileDockProps) {
  const pathname = usePathname()
  const [isCollapsed, setIsCollapsed] = useState(false)
  const collapseTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const links = useMemo<DockItem[]>(
    () => [
      { href: localizedSectionHref(locale, "about"), label: aboutLabel, icon: UserRound },
      { href: localizedSectionHref(locale, "packages"), label: packagesLabel, icon: PocketKnife },
      { href: "/portfolio", label: portfolioLabel, icon: PanelsTopLeft },
      { href: localizedSectionHref(locale, "services"), label: servicesLabel, icon: BriefcaseBusiness },
      { href: "/blog", label: blogLabel, icon: BookOpenText },
    ],
    [aboutLabel, blogLabel, locale, packagesLabel, portfolioLabel, servicesLabel],
  )

  const scheduleCollapse = useCallback(() => {
    if (collapseTimer.current) clearTimeout(collapseTimer.current)
    collapseTimer.current = setTimeout(() => {
      setIsCollapsed(true)
    }, 30_000)
  }, [])

  useEffect(() => {
    setIsCollapsed(false)
    scheduleCollapse()
    return () => {
      if (collapseTimer.current) clearTimeout(collapseTimer.current)
    }
  }, [pathname, scheduleCollapse])

  const handleDockInteraction = () => {
    setIsCollapsed(false)
    scheduleCollapse()
  }

  return (
    <>
      <div className="pointer-events-none fixed inset-x-0 bottom-4 z-[70] px-4 sm:hidden">
        <nav
          className={cn(
            "pointer-events-auto relative mx-auto flex w-full max-w-md items-center justify-between gap-1 rounded-[1.55rem] border border-black/10 bg-white/78 px-2 py-1 shadow-[0_20px_60px_rgba(15,23,42,0.14)] backdrop-blur-2xl transition-all duration-300 ease-in-out dark:border-white/10 dark:bg-[rgba(8,10,18,0.86)] dark:shadow-[0_24px_80px_rgba(0,0,0,0.5)]",
            isCollapsed ? "scale-0 opacity-0 translate-y-4 pointer-events-none" : "scale-100 opacity-100 translate-y-0",
          )}
        >
          <span
            aria-hidden
            className="pointer-events-none absolute inset-0 rounded-[1.55rem] bg-[linear-gradient(135deg,rgba(255,255,255,0.82),rgba(250,238,222,0.72))] dark:bg-[linear-gradient(135deg,rgba(10,14,22,0.94),rgba(18,22,34,0.82))]"
          />
          {links.map((item) => {
            const Icon = item.icon
            const active = item.href === "/" ? pathname === "/" : pathname === item.href || pathname?.startsWith(item.href + "/")
            return (
              <Link
                key={item.href}
                href={item.href}
                prefetch
                onClick={handleDockInteraction}
                className="relative flex flex-1 flex-col items-center justify-center gap-1 py-1"
                aria-label={item.label}
              >
                <span
                  className={cn(
                    "inline-flex h-9 w-9 items-center justify-center rounded-2xl border shadow-[inset_0_1px_0_rgba(255,255,255,0.2)] transition-colors",
                    active
                      ? "border-[color:var(--accent)]/35 bg-[color:var(--accent)]/14 text-[color:var(--accent)] dark:bg-[color:var(--accent)]/16"
                      : "border-black/10 bg-white/78 text-foreground dark:border-white/10 dark:bg-white/6 dark:text-white",
                  )}
                >
                  <Icon className="h-4 w-4" />
                </span>
                <span
                  className={cn(
                    "max-w-[4.5rem] truncate text-[9px] font-medium leading-none",
                    active ? "text-[color:var(--accent)]" : "text-muted-foreground dark:text-white/65",
                  )}
                >
                  {item.label}
                </span>
              </Link>
            )
          })}
        </nav>
      </div>

      <button
        type="button"
        aria-label="Show dock"
        onClick={handleDockInteraction}
        className={cn(
          "pointer-events-auto fixed right-4 bottom-6 z-[71] flex h-12 w-12 items-center justify-center rounded-full border border-black/10 bg-white/82 text-foreground shadow-[0_20px_60px_rgba(15,23,42,0.18)] backdrop-blur-2xl transition-all duration-300 ease-in-out dark:border-white/10 dark:bg-[rgba(8,10,18,0.84)] dark:text-white dark:shadow-[0_24px_80px_rgba(0,0,0,0.48)] sm:hidden",
          isCollapsed ? "scale-100 opacity-100" : "scale-0 opacity-0 pointer-events-none",
        )}
      >
        <Menu className="h-5 w-5" />
      </button>

      <div aria-hidden className="h-[calc(4.4rem+env(safe-area-inset-bottom))] sm:hidden" />
    </>
  )
}
