import { DotBackground } from "@/components/core/dot-background"
import type { ThemeMode } from "@/lib/theme"

type SiteParticleBackgroundProps = {
  theme: ThemeMode
}

// AGENCY_OWNED: theme-aware decorative background wrapper.
export function SiteParticleBackground({ theme }: SiteParticleBackgroundProps) {
  const isDark = theme === "dark"

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <DotBackground
        className="opacity-100 mix-blend-soft-light"
        quantity={320}
        speed={0.168}
        accentRatio={0.24}
        baseColor={isDark ? "191, 196, 206" : "83, 72, 63"}
        accentColor={isDark ? "235, 151, 72" : "246, 185, 138"}
        opacity={isDark ? 0.72 : 0.92}
      />
    </div>
  )
}
