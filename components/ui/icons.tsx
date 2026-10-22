import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface IconProps {
  size?: number
  className?: string
  strokeWidth?: number
  color?: string
}

function Svg({ size = 24, className, strokeWidth = 1.6, color = 'currentColor', children }: IconProps & { children: ReactNode }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cn('flex-shrink-0', className)}
    >
      {children}
    </svg>
  )
}

/* ── Category icons ──────────────────────────────────────── */

export function IconGates(p: IconProps) {
  return (
    <Svg {...p}>
      {/* two vertical bars = gate panels */}
      <rect x="2" y="4" width="8" height="16" rx="1" />
      <rect x="14" y="4" width="8" height="16" rx="1" />
      <line x1="6" y1="4" x2="6" y2="20" />
      <line x1="18" y1="4" x2="18" y2="20" />
      {/* hinge dots */}
      <circle cx="3.5" cy="7" r="0.8" fill={p.color ?? 'currentColor'} stroke="none" />
      <circle cx="3.5" cy="17" r="0.8" fill={p.color ?? 'currentColor'} stroke="none" />
      <circle cx="20.5" cy="7" r="0.8" fill={p.color ?? 'currentColor'} stroke="none" />
      <circle cx="20.5" cy="17" r="0.8" fill={p.color ?? 'currentColor'} stroke="none" />
    </Svg>
  )
}

export function IconCanopies(p: IconProps) {
  return (
    <Svg {...p}>
      {/* roof slope */}
      <polyline points="2,10 12,3 22,10" />
      {/* flat canopy */}
      <line x1="4" y1="10" x2="20" y2="10" />
      {/* two support columns */}
      <line x1="5" y1="10" x2="5" y2="21" />
      <line x1="19" y1="10" x2="19" y2="21" />
      {/* base */}
      <line x1="2" y1="21" x2="22" y2="21" />
    </Svg>
  )
}

export function IconRailings(p: IconProps) {
  return (
    <Svg {...p}>
      {/* top handrail */}
      <line x1="2" y1="6" x2="22" y2="6" />
      {/* bottom rail */}
      <line x1="2" y1="18" x2="22" y2="18" />
      {/* vertical balusters */}
      <line x1="5"  y1="6" x2="5"  y2="18" />
      <line x1="10" y1="6" x2="10" y2="18" />
      <line x1="14" y1="6" x2="14" y2="18" />
      <line x1="19" y1="6" x2="19" y2="18" />
      {/* end posts */}
      <line x1="2"  y1="4" x2="2"  y2="20" />
      <line x1="22" y1="4" x2="22" y2="20" />
    </Svg>
  )
}

export function IconGrills(p: IconProps) {
  return (
    <Svg {...p}>
      {/* grill body */}
      <path d="M4 10 Q4 6 12 6 Q20 6 20 10" />
      <line x1="3" y1="10" x2="21" y2="10" />
      {/* legs */}
      <line x1="7"  y1="10" x2="5"  y2="21" />
      <line x1="17" y1="10" x2="19" y2="21" />
      {/* crossbar */}
      <line x1="6" y1="16" x2="18" y2="16" />
      {/* grate lines */}
      <line x1="8"  y1="6.5" x2="8"  y2="10" />
      <line x1="12" y1="6"   x2="12" y2="10" />
      <line x1="16" y1="6.5" x2="16" y2="10" />
      {/* handle */}
      <line x1="12" y1="3" x2="12" y2="6" />
      <circle cx="12" cy="3" r="0.8" fill={p.color ?? 'currentColor'} stroke="none" />
    </Svg>
  )
}

export function IconFences(p: IconProps) {
  return (
    <Svg {...p}>
      {/* top rail */}
      <line x1="1" y1="8" x2="23" y2="8" />
      {/* bottom rail */}
      <line x1="1" y1="16" x2="23" y2="16" />
      {/* pickets with pointed tops */}
      <polyline points="3,16 3,5 5,3 7,5 7,16" />
      <polyline points="9,16 9,5 11,3 13,5 13,16" />
      <polyline points="15,16 15,5 17,3 19,5 19,16" />
      {/* ground */}
      <line x1="1" y1="21" x2="23" y2="21" />
      <line x1="5"  y1="16" x2="5"  y2="21" />
      <line x1="11" y1="16" x2="11" y2="21" />
      <line x1="17" y1="16" x2="17" y2="21" />
    </Svg>
  )
}

export function IconStairs(p: IconProps) {
  return (
    <Svg {...p}>
      {/* stair steps going up-right */}
      <polyline points="2,20 2,16 6,16 6,12 10,12 10,8 14,8 14,4 22,4" />
      {/* tread faces */}
      <line x1="6"  y1="16" x2="6"  y2="20" />
      <line x1="10" y1="12" x2="10" y2="16" />
      <line x1="14" y1="8"  x2="14" y2="12" />
      {/* handrail above */}
      <line x1="2" y1="17" x2="22" y2="3" />
      {/* post */}
      <line x1="22" y1="3" x2="22" y2="20" />
      <line x1="2"  y1="17" x2="2"  y2="20" />
    </Svg>
  )
}

export function IconPergolas(p: IconProps) {
  return (
    <Svg {...p}>
      {/* two vertical posts */}
      <line x1="4"  y1="8" x2="4"  y2="20" />
      <line x1="20" y1="8" x2="20" y2="20" />
      {/* horizontal crossbeam */}
      <line x1="2" y1="8" x2="22" y2="8" />
      {/* roof slats */}
      <line x1="6"  y1="4" x2="6"  y2="8" />
      <line x1="9"  y1="3" x2="9"  y2="8" />
      <line x1="12" y1="3" x2="12" y2="8" />
      <line x1="15" y1="3" x2="15" y2="8" />
      <line x1="18" y1="4" x2="18" y2="8" />
      {/* top connecting rail */}
      <line x1="5" y1="3" x2="19" y2="3" />
      {/* base */}
      <line x1="2" y1="20" x2="22" y2="20" />
    </Svg>
  )
}

export function IconFurniture(p: IconProps) {
  return (
    <Svg {...p}>
      {/* chair seat */}
      <rect x="5" y="11" width="10" height="2" rx="0.5" />
      {/* back */}
      <rect x="5" y="5" width="2" height="6" rx="0.5" />
      {/* front legs */}
      <line x1="6"  y1="13" x2="5"  y2="20" />
      <line x1="14" y1="13" x2="15" y2="20" />
      {/* back legs */}
      <line x1="6"  y1="5"  x2="5"  y2="20" />
      {/* backrest slat */}
      <line x1="5" y1="7"  x2="15" y2="7" />
      <line x1="5" y1="9"  x2="15" y2="9" />
      <line x1="15" y1="7" x2="15" y2="11" />
    </Svg>
  )
}

/* ── General icons ──────────────────────────────────────── */

export function IconWrench(p: IconProps) {
  return (
    <Svg {...p}>
      <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
    </Svg>
  )
}

export function IconHammer(p: IconProps) {
  return (
    <Svg {...p}>
      <path d="M15 12l-8.5 8.5a2.12 2.12 0 0 1-3-3L12 9" />
      <path d="M17.64 15L22 10.64" />
      <path d="m20.91 11.7-1.25-1.25c.653-.81.527-1.99-.284-2.642l-3.25-2.597c-.81-.653-1.99-.527-2.642.284L12 7.5l7 7 1.48-1.83c.653-.81.527-1.99-.284-2.642z" />
    </Svg>
  )
}

export function IconSearch(p: IconProps) {
  return (
    <Svg {...p}>
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </Svg>
  )
}

export function IconForge(p: IconProps) {
  return (
    <Svg {...p}>
      {/* anvil shape */}
      <rect x="6" y="12" width="12" height="5" rx="1" />
      <rect x="4" y="17" width="16" height="3" rx="1" />
      {/* horn */}
      <path d="M6 12 Q3 12 3 10 Q3 8 6 9" />
      {/* hammer */}
      <rect x="10" y="4" width="5" height="3" rx="0.5" />
      <line x1="12.5" y1="7" x2="12.5" y2="12" />
    </Svg>
  )
}

/* Map category ID → icon component */
export const CATEGORY_ICONS: Record<string, (p: IconProps) => ReactNode> = {
  gates: IconGates,
  canopies: IconCanopies,
  railings: IconRailings,
  grills: IconGrills,
  fences: IconFences,
  stairs: IconStairs,
  pergolas: IconPergolas,
  furniture: IconFurniture,
}
