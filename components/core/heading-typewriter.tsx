"use client"

import { useEffect } from "react"

const HEADING_SELECTOR = "h1, h2, h3, h4, h5, h6"
const CHAR_DELAY_MS = 34

// AGENCY_OWNED: distinctive heading animation used as part of the site's visual identity.
const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value))

function buildTypingMarkup(heading: HTMLElement) {
  const originalText = heading.textContent ?? ""
  if (!originalText.trim()) return false

  const fragment = document.createDocumentFragment()
  let charIndex = 0

  const tokens = originalText.split(/(\s+)/)
  for (const token of tokens) {
    if (!token) continue
    if (/^\s+$/.test(token)) {
      fragment.append(document.createTextNode(token))
      continue
    }

    const wordSpan = document.createElement("span")
    wordSpan.className = "title-typing-word"

    for (const char of Array.from(token)) {
      const charSpan = document.createElement("span")
      charSpan.className = "title-typing-char"
      charSpan.style.setProperty("--typing-char-index", String(charIndex))
      charSpan.textContent = char
      wordSpan.append(charSpan)
      charIndex += 1
    }

    fragment.append(wordSpan)
  }

  if (charIndex === 0) return false

  heading.textContent = ""
  heading.append(fragment)

  const totalDurationMs = clamp(charIndex * CHAR_DELAY_MS + 280, 680, 2600)
  heading.style.setProperty("--title-typing-char-delay", `${CHAR_DELAY_MS}ms`)
  heading.style.setProperty("--title-typing-total-duration", `${totalDurationMs}ms`)

  const existingCaret = heading.querySelector(".title-typing-caret")
  if (!existingCaret) {
    const caret = document.createElement("span")
    caret.className = "title-typing-caret"
    caret.setAttribute("aria-hidden", "true")
    heading.append(caret)
  }

  return true
}

type HeadingTypewriterProps = {
  scopeSelector?: string
}

export function HeadingTypewriter({ scopeSelector }: HeadingTypewriterProps) {
  useEffect(() => {
    if (typeof window === "undefined") return

    const media = window.matchMedia("(prefers-reduced-motion: reduce)")
    if (media.matches) return

    let observer: IntersectionObserver | null = null

    const resolveRoot = () => {
      if (!scopeSelector) {
        return document.body
      }

      const scoped = document.querySelector(scopeSelector)
      return scoped instanceof HTMLElement ? scoped : null
    }

    const registerHeadings = () => {
      const root = resolveRoot()
      if (!root) return

      const headings = Array.from(root.querySelectorAll<HTMLElement>(HEADING_SELECTOR))

      headings.forEach((heading) => {
        if (heading.dataset.typewriterInit === "true") return
        if (heading.dataset.typewriterSkip === "true") return

        heading.dataset.typewriterInit = "true"
        observer?.observe(heading)
      })
    }

    observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return
          const heading = entry.target as HTMLElement
          if (heading.dataset.typewriterPlayed === "true") return
          heading.classList.add("title-typewriter-ready")
          const prepared = buildTypingMarkup(heading)
          if (!prepared) {
            heading.dataset.typewriterPlayed = "true"
            observer?.unobserve(heading)
            return
          }
          heading.dataset.typewriterPlayed = "true"
          heading.classList.add("title-typewriter-active")
          observer?.unobserve(heading)
        })
      },
      { threshold: 0.24, rootMargin: "0px 0px -10% 0px" },
    )

    registerHeadings()

    const mutationObserver = new MutationObserver(() => {
      registerHeadings()
    })

    const root = resolveRoot()
    mutationObserver.observe(root || document.body, {
      childList: true,
      subtree: true,
    })

    return () => {
      observer?.disconnect()
      mutationObserver.disconnect()
    }
  }, [scopeSelector])

  return null
}
