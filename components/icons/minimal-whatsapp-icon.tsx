"use client"

import type { SVGProps } from "react"

type IconProps = SVGProps<SVGSVGElement>

const baseProps: Partial<IconProps> = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.6,
  strokeLinecap: "round",
  strokeLinejoin: "round",
}

// AGENCY_OWNED: lightweight reusable icon component for the contact surface.
export function MinimalWhatsappIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...baseProps} {...props}>
      <path d="M12 21c4.418 0 8-3.582 8-8s-3.582-8-8-8-8 3.582-8 8c0 1.25.29 2.43.8 3.48L4 20l3.7-1.3A7.96 7.96 0 0 0 12 21Z" />
      <path d="M9.75 11.25c0 1.66 1.34 3 3 3 .34 0 .66-.06.96-.17l1.54.88" />
      <path d="M13.5 9.5v-1" />
    </svg>
  )
}
