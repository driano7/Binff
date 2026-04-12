"use client"

import type { ReactNode } from "react"
import { useEffect, useMemo, useRef, useState } from "react"

import { cn } from "@/lib/utils"

type FruityScene = {
  eyebrow: string
  title: string
  summary: string
  bullets: readonly string[]
}

type ServicesFruityShowcaseProps = {
  scenes: ReadonlyArray<FruityScene>
}

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value))
const lerp = (start: number, end: number, ratio: number) => start + (end - start) * ratio

function useReducedMotion() {
  const [reduced, setReduced] = useState(false)

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)")
    const update = () => setReduced(media.matches)
    update()
    media.addEventListener("change", update)
    return () => media.removeEventListener("change", update)
  }, [])

  return reduced
}

function AnimatedSceneTitle({
  title,
  active,
}: {
  title: string
  active: boolean
}) {
  const words = title.split(/\s+/)

  return (
    <h2 className="text-balance font-serif text-4xl leading-[0.98] tracking-tight text-card-foreground sm:text-5xl lg:text-6xl">
      {words.map((word, index) => (
        <span key={`${word}-${index}`} className="inline-block overflow-hidden align-bottom">
          <span
            className={cn(
              "inline-block transition-all duration-500 ease-out",
              active ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0",
            )}
            style={{ transitionDelay: `${index * 70}ms` }}
          >
            {word}
          </span>
          {index < words.length - 1 ? "\u00a0" : null}
        </span>
      ))}
    </h2>
  )
}

function SceneShell({
  className,
  title,
  eyebrow,
  strength,
  reducedMotion,
  children,
}: {
  className: string
  title: string
  eyebrow: string
  strength: number
  reducedMotion: boolean
  children: ReactNode
}) {
  return (
    <div
      className={cn(
        "relative h-full overflow-hidden rounded-[2rem] border border-border/70 bg-card/96 shadow-[0_24px_60px_rgba(2,6,23,0.18)]",
        className,
      )}
      style={{
        opacity: strength < 0.05 ? 0.04 : lerp(0.5, 1, strength),
        transform: `translate3d(0, ${lerp(34, 0, strength)}px, 0) scale(${lerp(0.89, 1, strength)})`,
        filter: `blur(${strength < 0.08 ? 1 : 0}px)`,
      }}
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.16),transparent_42%),radial-gradient(circle_at_bottom_left,rgba(255,255,255,0.08),transparent_30%)]" />
      <div className="absolute left-4 top-4 z-20 flex items-center gap-2 rounded-full border border-border/60 bg-background/75 px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.28em] text-[color:var(--accent)] backdrop-blur">
        {eyebrow}
      </div>
      <div className="absolute right-4 top-4 z-20 rounded-full border border-border/60 bg-background/75 px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.24em] text-muted-foreground backdrop-blur">
        {title}
      </div>

      <div className="relative h-full">{children}</div>

      {!reducedMotion ? (
        <div className="pointer-events-none absolute inset-0 opacity-80" aria-hidden>
          <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-white/10 to-transparent" />
          <div className="absolute inset-x-8 bottom-0 h-12 rounded-full bg-black/10 blur-2xl dark:bg-black/20" />
        </div>
      ) : null}
    </div>
  )
}

function ProductBuildVisual({
  strength,
  reducedMotion,
}: {
  strength: number
  reducedMotion: boolean
}) {
  return (
    <SceneShell
      className="bg-[#060402] dark:bg-[#050301]"
      title="Product build"
      eyebrow="01 / Visual stack"
      strength={strength}
      reducedMotion={reducedMotion}
    >
      <div className="absolute inset-0 overflow-hidden">
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(circle at 50% 30%, rgba(255, 252, 246, 0.98) 0%, rgba(255, 231, 189, 0.9) 14%, rgba(255, 170, 88, 0.44) 30%, rgba(111, 48, 18, 0.2) 48%, rgba(6, 4, 2, 0.98) 100%)",
            filter: `saturate(1.42) brightness(${lerp(1.04, 1.14, strength)})`,
            animation: reducedMotion ? "none" : "service-product-field 8.8s ease-in-out infinite",
          }}
        />
        <div
          className="absolute inset-0 opacity-95 mix-blend-screen"
          style={{
            background:
              "radial-gradient(circle at 50% 36%, rgba(255, 251, 244, 0.98) 0%, rgba(255, 231, 188, 0.74) 16%, rgba(255, 166, 84, 0.3) 30%, transparent 54%), radial-gradient(circle at 20% 20%, rgba(255, 177, 115, 0.48) 0%, transparent 20%), radial-gradient(circle at 80% 22%, rgba(255, 112, 70, 0.36) 0%, transparent 18%), radial-gradient(circle at 22% 80%, rgba(42, 198, 141, 0.12) 0%, transparent 22%), radial-gradient(circle at 76% 78%, rgba(255, 194, 129, 0.2) 0%, transparent 18%)",
            animation: reducedMotion ? "none" : "service-product-orbit 9.4s ease-in-out infinite alternate",
          }}
        />
        <div className="absolute left-[10%] top-[18%]">
          <div
            className="h-[min(28vw,178px)] w-[min(28vw,178px)] rounded-full blur-[72px]"
            style={{
              background:
                "radial-gradient(circle at 40% 38%, rgba(255, 244, 222, 0.96) 0%, rgba(255, 199, 128, 0.68) 24%, rgba(255, 138, 63, 0.16) 58%, transparent 76%)",
              animation: reducedMotion ? "none" : "service-product-drift-a 8.8s ease-in-out infinite",
            }}
          />
        </div>
        <div className="absolute right-[8%] top-[20%]">
          <div
            className="h-[min(30vw,198px)] w-[min(30vw,198px)] rounded-full blur-[76px]"
            style={{
              background:
                "radial-gradient(circle at 44% 42%, rgba(255, 165, 103, 0.86) 0%, rgba(255, 103, 63, 0.34) 28%, transparent 72%)",
              animation: reducedMotion ? "none" : "service-product-drift-b 10.6s ease-in-out infinite",
            }}
          />
        </div>
        <div className="absolute left-[18%] bottom-[16%]">
          <div
            className="h-[min(24vw,160px)] w-[min(24vw,160px)] rounded-full blur-[72px]"
            style={{
              background:
                "radial-gradient(circle at 45% 45%, rgba(255, 191, 121, 0.62) 0%, rgba(255, 128, 64, 0.28) 28%, transparent 74%)",
              animation: reducedMotion ? "none" : "service-product-drift-c 11.2s ease-in-out infinite",
            }}
          />
        </div>
        <div className="absolute right-[18%] bottom-[18%]">
          <div
            className="h-[min(18vw,120px)] w-[min(18vw,120px)] rounded-full blur-[56px]"
            style={{
              background:
                "radial-gradient(circle at 46% 44%, rgba(36, 194, 140, 0.28) 0%, rgba(36, 194, 140, 0.1) 35%, transparent 70%)",
              animation: reducedMotion ? "none" : "service-product-drift-d 12.2s ease-in-out infinite",
            }}
          />
        </div>
        <div className="absolute inset-x-0 bottom-0 h-36 bg-gradient-to-t from-[#050302] via-[#050302]/94 to-transparent" />
        <div className="absolute inset-0 opacity-[0.1] [background-image:radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.5)_1px,transparent_0)] [background-size:24px_24px]" />
        <div className="absolute left-1/2 top-[50%] -translate-x-1/2 -translate-y-1/2">
          <div
            className="h-[min(66vw,340px)] w-[min(66vw,340px)] rounded-full blur-[88px]"
            style={{
              background:
                "radial-gradient(circle at 42% 40%, rgba(255, 255, 247, 0.98) 0%, rgba(255, 234, 197, 0.9) 24%, rgba(255, 194, 130, 0.56) 48%, rgba(255, 142, 72, 0.16) 70%, transparent 82%)",
              animation: reducedMotion ? "none" : "service-product-core 5.2s ease-in-out infinite",
            }}
          />
        </div>
        <div
          className="absolute left-1/2 top-[50%] h-[min(74vw,360px)] w-[min(74vw,360px)] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[conic-gradient(from_180deg,rgba(255,255,255,0),rgba(255,123,61,0.72),rgba(255,241,217,1),rgba(255,123,61,0.82),rgba(255,255,255,0))] blur-[76px] mix-blend-screen"
          style={{
            animation: reducedMotion ? "none" : "service-product-ring-spin 11s linear infinite",
          }}
        />
        <div
          className="absolute inset-x-[13%] top-[50%] h-[2px] rounded-full bg-gradient-to-r from-transparent via-[rgba(255,243,223,0.94)] to-transparent blur-[1px]"
          style={{
            animation: reducedMotion ? "none" : "service-product-scan 4.8s ease-in-out infinite",
          }}
        />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,transparent_34%,rgba(6,4,2,0.22)_68%,rgba(6,4,2,0.58)_100%)]" />
        <div className="absolute bottom-[18%] left-[14%] h-10 w-24 rounded-full bg-black/18 blur-2xl" />
        <div className="absolute bottom-[16%] right-[16%] h-14 w-28 rounded-full bg-black/20 blur-2xl" />
      </div>
    </SceneShell>
  )
}

function VisibilityVisual({
  strength,
  reducedMotion,
}: {
  strength: number
  reducedMotion: boolean
}) {
  return (
    <SceneShell
      className="bg-[#020305] dark:bg-[#010204]"
      title="Visibility"
      eyebrow="02 / Bound motion"
      strength={strength}
      reducedMotion={reducedMotion}
    >
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.02),transparent_26%),linear-gradient(180deg,rgba(2,3,5,1),rgba(2,3,5,1))]" />
        <div className="absolute inset-0 opacity-[0.08] [background-image:linear-gradient(rgba(255,255,255,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.08)_1px,transparent_1px)] [background-size:28px_28px]" />

        <svg className="absolute inset-0 h-full w-full" viewBox="0 0 1000 700" preserveAspectRatio="none" aria-hidden>
          <defs>
            <linearGradient id="visLineA" x1="0" x2="1" y1="0" y2="0">
              <stop offset="0%" stopColor="rgba(255,255,255,0)" />
              <stop offset="48%" stopColor="#ff2f9e" />
              <stop offset="68%" stopColor="#ff7a3d" />
              <stop offset="100%" stopColor="rgba(255,255,255,0)" />
            </linearGradient>
            <linearGradient id="visLineB" x1="0" x2="1" y1="0" y2="0">
              <stop offset="0%" stopColor="rgba(255,255,255,0)" />
              <stop offset="46%" stopColor="#ff22a6" />
              <stop offset="100%" stopColor="rgba(255,255,255,0)" />
            </linearGradient>
            <linearGradient id="visLineC" x1="0" x2="1" y1="0" y2="0">
              <stop offset="0%" stopColor="rgba(255,255,255,0)" />
              <stop offset="42%" stopColor="#ffb35c" />
              <stop offset="62%" stopColor="#ff4ab9" />
              <stop offset="100%" stopColor="rgba(255,255,255,0)" />
            </linearGradient>
            <filter id="visGlow">
              <feGaussianBlur stdDeviation="5.2" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          <g transform="translate(-108 0)">
            <path
              d="M 624 118 C 744 132, 796 208, 752 274 C 704 346, 676 402, 706 470"
              fill="none"
              stroke="url(#visLineA)"
              strokeWidth="5"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeDasharray="12 16"
              style={{
                filter: "url(#visGlow)",
                animation: reducedMotion ? "none" : "service-line-drift 7.2s linear infinite",
                opacity: 1,
              }}
            />
            <path
              d="M 648 124 C 756 145, 780 214, 742 276 C 702 344, 694 390, 726 458"
              fill="none"
              stroke="url(#visLineB)"
              strokeWidth="3.6"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeDasharray="8 12"
              style={{
                filter: "url(#visGlow)",
                animation: reducedMotion ? "none" : "service-line-drift 8.2s linear infinite reverse",
                opacity: 0.96,
              }}
            />
            <path
              d="M 610 150 C 714 168, 764 228, 738 288 C 710 353, 704 406, 746 474"
              fill="none"
              stroke="url(#visLineC)"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeDasharray="4 10"
              style={{
                filter: "url(#visGlow)",
                animation: reducedMotion ? "none" : "service-line-drift 6.4s linear infinite",
                opacity: 0.92,
              }}
            />
            <path
              d="M 614 198 C 726 198, 790 228, 796 278 C 801 325, 778 374, 744 446"
              fill="none"
              stroke="#ff61c6"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeDasharray="2 10"
              style={{
                filter: "url(#visGlow)",
                animation: reducedMotion ? "none" : "service-line-drift 9s linear infinite reverse",
                opacity: 0.78,
              }}
            />
          </g>
        </svg>
      </div>
    </SceneShell>
  )
}

function SystemsLayerVisual({
  strength,
  reducedMotion,
}: {
  strength: number
  reducedMotion: boolean
}) {
  const spheres = useMemo(
    () =>
      [
        { x: 0.24, y: 0.17, vx: 0.016, vy: 0.012, size: 0.15, color: "rgba(56, 189, 248, 0.98)", glow: "rgba(56, 189, 248, 0.28)" },
        { x: 0.47, y: 0.22, vx: -0.013, vy: 0.015, size: 0.095, color: "rgba(244, 114, 182, 0.98)", glow: "rgba(244, 114, 182, 0.24)" },
        { x: 0.73, y: 0.2, vx: 0.011, vy: -0.013, size: 0.11, color: "rgba(251, 146, 60, 0.98)", glow: "rgba(251, 146, 60, 0.28)" },
        { x: 0.26, y: 0.5, vx: 0.014, vy: -0.012, size: 0.08, color: "rgba(16, 185, 129, 0.96)", glow: "rgba(16, 185, 129, 0.22)" },
        { x: 0.56, y: 0.48, vx: -0.01, vy: 0.013, size: 0.125, color: "rgba(249, 115, 22, 0.98)", glow: "rgba(249, 115, 22, 0.28)" },
        { x: 0.72, y: 0.7, vx: -0.014, vy: 0.012, size: 0.085, color: "rgba(245, 158, 11, 0.98)", glow: "rgba(245, 158, 11, 0.24)" },
        { x: 0.18, y: 0.78, vx: 0.01, vy: -0.014, size: 0.07, color: "rgba(34, 211, 238, 0.94)", glow: "rgba(34, 211, 238, 0.2)" },
      ] as const,
    [],
  )

  return (
    <SceneShell
      className="bg-[#04070b] dark:bg-[#030407]"
      title="Systems layer"
      eyebrow="03 / Final can"
      strength={strength}
      reducedMotion={reducedMotion}
    >
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.04),transparent_30%),linear-gradient(180deg,rgba(4,7,11,1),rgba(4,7,11,1))]" />
        <div className="absolute inset-0 opacity-[0.12] [background-image:radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.35)_1px,transparent_0)] [background-size:26px_26px]" />
        <div className="absolute left-1/2 top-1/2 h-[min(54vw,340px)] w-[min(54vw,340px)] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.07),transparent_66%)]" />
        <div className="absolute left-1/2 top-[48%] h-[min(58vw,390px)] w-[min(58vw,390px)] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle_at_center,rgba(255,73,179,0.14),transparent_42%)] blur-2xl" />

        <div className="absolute left-1/2 top-1/2 w-full max-w-[520px] -translate-x-1/2 -translate-y-1/2 px-6">
          <div
            className="relative mx-auto aspect-square h-[min(64vw,520px)] w-[min(64vw,520px)]"
            style={{
              animation: reducedMotion ? "none" : "service-system-bob 3.8s ease-in-out infinite",
            }}
          >
            {spheres.map((sphere, index) => (
              <div
                key={`${sphere.color}-${index}`}
                className="absolute rounded-full"
                style={{
                  left: `${sphere.x * 100}%`,
                  top: `${sphere.y * 100}%`,
                  width: `calc(${sphere.size * 100}% * ${lerp(0.94, 1.03, strength)})`,
                  height: `calc(${sphere.size * 100}% * ${lerp(0.94, 1.03, strength)})`,
                  background: sphere.color,
                  boxShadow: `0 0 48px ${sphere.glow}, 0 0 96px ${sphere.glow}`,
                  filter: `saturate(${lerp(1.1, 1.35, strength)}) brightness(${lerp(0.96, 1.12, strength)})`,
                  transform: `translate3d(-50%, -50%, 0)`,
                  opacity: lerp(0.82, 1, strength),
                  animation: reducedMotion ? "none" : `service-system-float-${index % 4} ${2.8 + (index % 4) * 0.4}s ease-in-out infinite`,
                  animationDelay: `${index * 90}ms`,
                }}
              />
            ))}
            <div className="absolute inset-0 rounded-[2.5rem] border border-white/10 bg-[radial-gradient(circle_at_50%_50%,transparent_40%,rgba(255,255,255,0.03)_60%,transparent_100%)]" />
          </div>
        </div>
      </div>
    </SceneShell>
  )
}

function SceneVisual({
  index,
  progress,
  reducedMotion,
}: {
  index: number
  progress: number
  reducedMotion: boolean
}) {
  const distance = index - progress
  const absDistance = Math.abs(distance)
  const enter = clamp(1 - absDistance, 0, 1)

  return (
    <div
      className="relative h-full rounded-[2rem]"
      style={{
        transform: `translate3d(0, ${distance * 30 + lerp(28, 0, enter)}px, 0) scale(${lerp(0.91, 1, enter)})`,
        opacity: absDistance > 1.2 ? 0 : lerp(0.56, 1, enter),
      }}
    >
      {index === 0 ? (
        <ProductBuildVisual strength={enter} reducedMotion={reducedMotion} />
      ) : index === 1 ? (
        <VisibilityVisual strength={enter} reducedMotion={reducedMotion} />
      ) : (
        <SystemsLayerVisual strength={enter} reducedMotion={reducedMotion} />
      )}
    </div>
  )
}

function ScenePanel({
  scene,
  index,
  progress,
  reducedMotion,
}: {
  scene: FruityScene
  index: number
  progress: number
  reducedMotion: boolean
}) {
  const distance = Math.abs(index - progress)
  const isActive = distance < 0.5
  const visibility = clamp(1 - distance * 1.5, 0, 1)
  const opacity = visibility < 0.12 ? 0 : lerp(0.65, 1, visibility)
  const lift = lerp(18, 0, clamp(1 - distance, 0, 1))

  return (
    <div
      className="absolute inset-0 p-4 sm:p-6 lg:p-8"
      style={{
        opacity,
        transform: `translate3d(0, ${lift}px, 0)`,
        pointerEvents: isActive ? "auto" : "none",
      }}
    >
      <div className="grid h-full items-center gap-6 lg:grid-cols-[1.04fr_0.96fr]">
        <div className="space-y-5">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[color:var(--accent)]">{scene.eyebrow}</p>
          <AnimatedSceneTitle title={scene.title} active={isActive} />
          <p className="max-w-2xl text-sm leading-7 text-muted-foreground md:text-base">{scene.summary}</p>
          <div className="grid gap-2 sm:max-w-xl sm:grid-cols-3">
            {scene.bullets.map((bullet, bulletIndex) => (
              <div
                key={bullet}
                className="rounded-2xl border border-border/60 bg-background/70 px-4 py-3 text-sm leading-6 text-card-foreground transition-all duration-500 ease-out"
                style={{
                  transform: `translateY(${isActive ? 0 : 12 + bulletIndex * 4}px)`,
                  transitionDelay: `${bulletIndex * 80}ms`,
                }}
              >
                {bullet}
              </div>
            ))}
          </div>
        </div>

        <SceneVisual index={index} progress={progress} reducedMotion={reducedMotion} />
      </div>
    </div>
  )
}

function MobileSceneCard({
  scene,
  index,
  reducedMotion,
}: {
  scene: FruityScene
  index: number
  reducedMotion: boolean
}) {
  return (
    <section className="rounded-[2rem] border border-border/70 bg-card/96 p-4 shadow-[0_24px_60px_rgba(2,6,23,0.18)] sm:p-5">
      <div className="mb-4">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[color:var(--accent)]">{scene.eyebrow}</p>
        <AnimatedSceneTitle title={scene.title} active />
        <p className="mt-3 text-sm leading-7 text-muted-foreground">{scene.summary}</p>
      </div>

      <div className="mb-4 rounded-[1.75rem] border border-border/60 bg-background/60">
        <div className="h-[240px] overflow-hidden sm:h-[280px]">
          {index === 0 ? (
            <ProductBuildVisual strength={1} reducedMotion={reducedMotion} />
          ) : index === 1 ? (
            <VisibilityVisual strength={1} reducedMotion={reducedMotion} />
          ) : (
            <SystemsLayerVisual strength={1} reducedMotion={reducedMotion} />
          )}
        </div>
      </div>

      <div className="grid gap-2 sm:grid-cols-3">
        {scene.bullets.map((bullet) => (
          <div
            key={bullet}
            className="rounded-2xl border border-border/60 bg-background/70 px-4 py-3 text-sm leading-6 text-card-foreground"
          >
            {bullet}
          </div>
        ))}
      </div>
    </section>
  )
}

export function ServicesFruityShowcase({ scenes }: ServicesFruityShowcaseProps) {
  const wrapperRef = useRef<HTMLDivElement | null>(null)
  const reducedMotion = useReducedMotion()
  const [state, setState] = useState({ progress: 0 })

  useEffect(() => {
    if (reducedMotion) {
      setState({ progress: 0 })
      return
    }

    let frame = 0

    const update = () => {
      const wrapper = wrapperRef.current
      if (!wrapper) return

      const rect = wrapper.getBoundingClientRect()
      const start = window.scrollY + rect.top
      const rawProgress = (window.scrollY - start) / (window.innerHeight * 0.88)
      const clampedProgress = clamp(rawProgress, 0, Math.max(0, scenes.length - 1))
      setState({ progress: clampedProgress })
    }

    const schedule = () => {
      window.cancelAnimationFrame(frame)
      frame = window.requestAnimationFrame(update)
    }

    update()
    window.addEventListener("scroll", schedule, { passive: true })
    window.addEventListener("resize", schedule)

    return () => {
      window.cancelAnimationFrame(frame)
      window.removeEventListener("scroll", schedule)
      window.removeEventListener("resize", schedule)
    }
  }, [reducedMotion, scenes.length])

  const jumpToScene = (index: number) => {
    const wrapper = wrapperRef.current
    if (!wrapper) return

    const top = wrapper.getBoundingClientRect().top + window.scrollY
    window.scrollTo({
      top: top + index * window.innerHeight,
      behavior: reducedMotion ? "auto" : "smooth",
    })
  }

  return (
    <>
    <section ref={wrapperRef} className="relative mt-8">
        <div className="relative hidden lg:block" style={{ height: `${Math.max(1, scenes.length) * 92}svh` }}>
          <div className="sticky top-24 h-[calc(100svh-7rem)]">
            <div className="relative h-full">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.1),transparent_42%),linear-gradient(135deg,rgba(251,146,60,0.04),transparent_42%,rgba(59,130,246,0.05))]" />
              <div className="absolute inset-0 opacity-[0.16] [background-image:radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.45)_1px,transparent_0)] [background-size:24px_24px] dark:opacity-[0.08]" />

              <div className="absolute left-4 top-4 z-20 flex flex-wrap gap-2 sm:left-6 sm:top-6">
                {scenes.map((scene, index) => {
                  const active = Math.round(state.progress) === index
                  return (
                    <button
                      key={scene.title}
                      type="button"
                      onClick={() => jumpToScene(index)}
                      className={cn(
                        "relative overflow-hidden rounded-full border px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] transition",
                        active
                          ? "border-[color:var(--accent)]/35 bg-[color:var(--accent)]/12 text-[color:var(--accent)]"
                          : "border-border/60 bg-background/70 text-muted-foreground hover:border-[color:var(--accent)]/30 hover:text-card-foreground",
                      )}
                    >
                      {active ? (
                        <span className="absolute inset-0 rounded-full border border-[color:var(--accent)]/20 opacity-20" />
                      ) : null}
                      <span className="relative">{scene.eyebrow}</span>
                    </button>
                  )
                })}
              </div>

              <div className="relative h-full">
                {scenes.map((scene, index) => (
                  <ScenePanel
                    key={scene.title}
                    scene={scene}
                    index={index}
                    progress={state.progress}
                    reducedMotion={reducedMotion}
                  />
                ))}
              </div>

              <div className="absolute bottom-4 left-1/2 z-20 -translate-x-1/2 sm:bottom-6">
                <div className="flex items-center gap-2 rounded-full border border-border/60 bg-background/80 px-3 py-2 shadow-[0_14px_32px_rgba(2,6,23,0.12)] backdrop-blur">
                  {scenes.map((scene, index) => {
                    const active = Math.round(state.progress) === index
                    return (
                      <button
                        key={scene.title}
                        type="button"
                        onClick={() => jumpToScene(index)}
                        className={cn(
                          "h-2.5 rounded-full transition-all duration-300",
                          active ? "w-10 bg-[color:var(--accent)]" : "w-2.5 bg-border/80 hover:bg-[color:var(--accent)]/45",
                        )}
                        aria-label={scene.title}
                      />
                    )
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid gap-6 lg:hidden">
          {scenes.map((scene, index) => (
            <MobileSceneCard key={scene.title} scene={scene} index={index} reducedMotion={reducedMotion} />
          ))}
        </div>
      </section>

      <style jsx global>{`
        @keyframes service-product-breathe {
          0%,
          100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.06);
          }
        }

        @keyframes service-product-spot {
          0%,
          100% {
            transform: scale(0.95);
          }
          50% {
            transform: scale(1.08);
          }
        }

        @keyframes service-product-flare {
          0%,
          100% {
            transform: scale(0.88);
          }
          50% {
            transform: scale(1.04);
          }
        }

        @keyframes service-product-field {
          0%,
          100% {
            transform: translate3d(0, 0, 0) scale(1);
          }
          25% {
            transform: translate3d(-8px, -12px, 0) scale(1.03);
          }
          50% {
            transform: translate3d(10px, 8px, 0) scale(1.06);
          }
          75% {
            transform: translate3d(-6px, 14px, 0) scale(1.02);
          }
        }

        @keyframes service-product-orbit {
          0% {
            transform: translate3d(0, 0, 0) scale(1);
          }
          18% {
            transform: translate3d(8px, -16px, 0) scale(1.04);
          }
          50% {
            transform: translate3d(-10px, -4px, 0) scale(1.06);
          }
          82% {
            transform: translate3d(12px, 10px, 0) scale(1.03);
          }
          100% {
            transform: translate3d(0, 0, 0) scale(1);
          }
        }

        @keyframes service-product-core {
          0%,
          100% {
            transform: scale(0.96) translate3d(0, 0, 0);
            opacity: 0.9;
          }
          35% {
            transform: scale(1.06) translate3d(-6px, -8px, 0);
            opacity: 1;
          }
          65% {
            transform: scale(1.12) translate3d(8px, 10px, 0);
            opacity: 0.95;
          }
        }

        @keyframes service-product-drift-a {
          0%,
          100% {
            transform: translate3d(0, 0, 0) scale(1);
          }
          40% {
            transform: translate3d(12px, -18px, 0) scale(1.1);
          }
          70% {
            transform: translate3d(-10px, 10px, 0) scale(0.96);
          }
        }

        @keyframes service-product-drift-b {
          0%,
          100% {
            transform: translate3d(0, 0, 0) scale(1);
          }
          32% {
            transform: translate3d(-14px, 14px, 0) scale(1.08);
          }
          68% {
            transform: translate3d(10px, -8px, 0) scale(0.98);
          }
        }

        @keyframes service-product-drift-c {
          0%,
          100% {
            transform: translate3d(0, 0, 0) scale(1);
          }
          45% {
            transform: translate3d(10px, -10px, 0) scale(1.12);
          }
          78% {
            transform: translate3d(-8px, 8px, 0) scale(0.97);
          }
        }

        @keyframes service-product-drift-d {
          0%,
          100% {
            transform: translate3d(0, 0, 0) scale(1);
          }
          38% {
            transform: translate3d(-8px, 8px, 0) scale(1.14);
          }
          72% {
            transform: translate3d(8px, -6px, 0) scale(0.94);
          }
        }

        @keyframes service-product-ring-spin {
          0% {
            transform: translate3d(-50%, -50%, 0) rotate(0deg);
          }
          100% {
            transform: translate3d(-50%, -50%, 0) rotate(360deg);
          }
        }

        @keyframes service-product-scan {
          0%,
          100% {
            transform: translate3d(0, 0, 0) scaleX(0.78);
            opacity: 0.25;
          }
          50% {
            transform: translate3d(0, -16px, 0) scaleX(1);
            opacity: 0.98;
          }
        }

        @keyframes service-line-drift {
          0% {
            stroke-dashoffset: 0;
            transform: translate3d(0, 0, 0);
          }
          50% {
            stroke-dashoffset: -60;
            transform: translate3d(2px, -2px, 0);
          }
          100% {
            stroke-dashoffset: -120;
            transform: translate3d(0, 0, 0);
          }
        }

        @keyframes service-system-bob {
          0%,
          100% {
            transform: translate3d(0, 0, 0);
          }
          50% {
            transform: translate3d(0, -16px, 0);
          }
        }

        @keyframes service-system-float-0 {
          0%,
          100% {
            transform: translate3d(-50%, -50%, 0) translate3d(0, 0, 0);
          }
          50% {
            transform: translate3d(-50%, -50%, 0) translate3d(34px, -26px, 0);
          }
        }

        @keyframes service-system-float-1 {
          0%,
          100% {
            transform: translate3d(-50%, -50%, 0) translate3d(0, 0, 0);
          }
          50% {
            transform: translate3d(-50%, -50%, 0) translate3d(-30px, 26px, 0);
          }
        }

        @keyframes service-system-float-2 {
          0%,
          100% {
            transform: translate3d(-50%, -50%, 0) translate3d(0, 0, 0);
          }
          50% {
            transform: translate3d(-50%, -50%, 0) translate3d(26px, 32px, 0);
          }
        }

        @keyframes service-system-float-3 {
          0%,
          100% {
            transform: translate3d(-50%, -50%, 0) translate3d(0, 0, 0);
          }
          50% {
            transform: translate3d(-50%, -50%, 0) translate3d(-24px, -24px, 0);
          }
        }

        @keyframes service-bounce-drift {
          0%,
          100% {
            transform: translate3d(0, 0, 0);
          }
          22% {
            transform: translate3d(10px, -12px, 0);
          }
          48% {
            transform: translate3d(-12px, 14px, 0);
          }
          74% {
            transform: translate3d(8px, 10px, 0);
          }
        }
      `}</style>
    </>
  )
}
