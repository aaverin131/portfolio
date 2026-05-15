import { useEffect, useRef } from "react"

// ─── CONFIG TYPES ────────────────────────────────────────────────────────────
//
// Mental model:
//   yd = scrollY + viewportH    (the user's bottommost visible pixel)
//   triggerY = anchorY + (triggerOffset ?? 0)
//   length = clamp(0, (yd - triggerY) * growthRate * lengthScale,
//                  maxLength * lengthScale)
//
// Deterministic — reload anywhere on the page and ribbons compute correctly
// from scrollY alone. No emerge animation, no arm/dormant state.

type GroupOverrides = {
  anchorX?: number
  anchorY?: number
  angle?: number
  triggerOffset?: number
  growthRate?: number
  maxLength?: number
}

type GroupConfig = {
  id: string
  anchorX: number          // 0..1 — fraction of viewport width. 0 = left edge, 1 = right edge
  anchorY: number          // px from top of document — where the ribbon group visually sits (ribbony)
  angle: number            // degrees. 0 = →, 25 = ↘, 155 = ↙, -25 = ↗
  triggerOffset?: number   // px shift for the growth trigger relative to anchorY.
                           //   negative = activate earlier (above anchor) — useful for ~horizontal ribbons
                           //   positive = activate later
                           //   omitted = 0 → triggerY equals anchorY
  growthRate: number       // px of ribbon length added per px of scroll past trigger
  maxLength: number        // hard cap on length in px
  bend?: {
    triggerLength: number  // px length at which the trunk ends and the branch begins
    angle: number          // absolute angle (degrees) of the second segment
  }
  mobile?: GroupOverrides  // optional overrides applied when innerWidth <= MOBILE_BREAKPOINT
}

type RibbonConfig = {
  id: string
  groupId: string
  xOffset: number
  yOffset: number          // visual y shift only — does NOT affect the trigger
  thickness: number
  color: string
  color2?: string
  opacity: number
  tipSide: "top" | "bottom"
  slopePct: number
  lengthScale: number      // multiplier on both growthRate and maxLength for this ribbon
}

// Viewport width at or below which `mobile` overrides on a group take effect.
const MOBILE_BREAKPOINT = 768

// ─── EDIT THESE ──────────────────────────────────────────────────────────────
// Tuning notes:
//   - `anchorY` places the ribbon in document space (px from top of <main>).
//   - `growthRate` is px of length added per px of scroll past the trigger.
//   - `maxLength` is the hard cap on length, in px.
//   - `triggerOffset` shifts the activation point relative to `anchorY`.
//     Use negative values for near-horizontal ribbons (angle near 0 or 180) so
//     they ramp in gradually instead of snapping into view.
//   - Per-ribbon `lengthScale` is a multiplier on both growth and cap, used to
//     stagger ribbons within a group while preserving their relative proportions.
const GROUPS: GroupConfig[] = [
  {
    id: "bottom-1",
    anchorX: 1,
    anchorY: 500,
    angle: 158,
    growthRate: 1.4,
    maxLength: 4000,
  },
  {
    id: "bottom-2",
    anchorX: -0.3,
    anchorY: 1350,
    angle: 22,
    growthRate: 1.4,
    maxLength: 4000,
  },
  {
    id: "middle-1",
    anchorX: 1,
    anchorY: 0,
    angle: 170,
    triggerOffset: -200,   // near-horizontal — activate earlier so it doesn't snap in
    growthRate: 50,        // old config was static; ramps to cap almost instantly
    maxLength: 1800,
  },
  {
    id: "middle-2",
    anchorX: 0,
    anchorY: 500,
    angle: 30,
    growthRate: 1.6,
    maxLength: 2800,
  },
  {
    id: "middle-3",
    anchorX: 1.1,
    anchorY: 1700,
    angle: 150,
    growthRate: 0.25,
    maxLength: 400,
  },
  {
    id: "top-1",
    anchorX: 0.1,
    anchorY: -110,
    angle: 30,
    growthRate: 9,
    maxLength: 1800,
  },
  {
    id: "top-2",
    anchorX: 1.1,
    anchorY: 1000,
    angle: 150,
    triggerOffset: -150,   // near-horizontal-ish — soft early trigger
    growthRate: 1.4,
    maxLength: 2250,
    bend: { triggerLength: 1350, angle: 180 },
  },
  {
    id: "top-3",
    anchorX: -0.2,
    anchorY: 3250,
    angle: 0,
    triggerOffset: -300,   // fully horizontal — strongest early trigger
    growthRate: 3.6,
    maxLength: 18000,
  },
]

// Each ribbon belongs to a group (via `groupId`) and contributes its own
// thickness, color, opacity, vertical stacking offset, and an optional
// length multiplier. Three ribbons per group is the standard layout.
const RIBBONS: RibbonConfig[] = [
  { id: "r4a", groupId: "bottom-1", xOffset: 0, yOffset: 0,        thickness: 17, color: "var(--ribbon-bottom-top)",    opacity: 0.7, tipSide: "top", slopePct: 0, lengthScale: 1.2 },
  { id: "r4b", groupId: "bottom-1", xOffset: 0, yOffset: 42 - 10,  thickness: 17, color: "var(--ribbon-bottom-middle)", opacity: 0.7, tipSide: "top", slopePct: 0, lengthScale: 1.1 },
  { id: "r4c", groupId: "bottom-1", xOffset: 0, yOffset: 84 - 20,  thickness: 17, color: "var(--ribbon-bottom-bottom)", opacity: 0.7, tipSide: "top", slopePct: 0, lengthScale: 1 },

  { id: "r7a", groupId: "bottom-2", xOffset: 0, yOffset: 0,        thickness: 17, color: "var(--ribbon-bottom-top)",    opacity: 0.7, tipSide: "top", slopePct: 0, lengthScale: 1.2 },
  { id: "r7b", groupId: "bottom-2", xOffset: 0, yOffset: 42 - 10,  thickness: 17, color: "var(--ribbon-bottom-middle)", opacity: 0.7, tipSide: "top", slopePct: 0, lengthScale: 1.1 },
  { id: "r7c", groupId: "bottom-2", xOffset: 0, yOffset: 84 - 20,  thickness: 17, color: "var(--ribbon-bottom-bottom)", opacity: 0.7, tipSide: "top", slopePct: 0, lengthScale: 1 },

  { id: "r8a", groupId: "middle-3", xOffset: 0, yOffset: 0,        thickness: 21, color: "var(--ribbon-middle-top)",    opacity: 1, tipSide: "top", slopePct: 0, lengthScale: 1.2 },
  { id: "r8b", groupId: "middle-3", xOffset: 0, yOffset: 42,       thickness: 21, color: "var(--ribbon-middle-middle)", opacity: 1, tipSide: "top", slopePct: 0, lengthScale: 1.1 },
  { id: "r8c", groupId: "middle-3", xOffset: 0, yOffset: 84 - 6,   thickness: 21, color: "var(--ribbon-middle-bottom)", opacity: 1, tipSide: "top", slopePct: 0, lengthScale: 1 },

  { id: "r3a", groupId: "middle-2", xOffset: 0, yOffset: 0,        thickness: 21, color: "var(--ribbon-middle-top)",    opacity: 1, tipSide: "top", slopePct: 0, lengthScale: 1.2 },
  { id: "r3b", groupId: "middle-2", xOffset: 0, yOffset: 42,       thickness: 21, color: "var(--ribbon-middle-middle)", opacity: 1, tipSide: "top", slopePct: 0, lengthScale: 1.1 },
  { id: "r3c", groupId: "middle-2", xOffset: 0, yOffset: 84 - 6,   thickness: 21, color: "var(--ribbon-middle-bottom)", opacity: 1, tipSide: "top", slopePct: 0, lengthScale: 1 },

  { id: "r2a", groupId: "middle-1", xOffset: 0, yOffset: 0,        thickness: 21, color: "var(--ribbon-middle-top)",    opacity: 1, tipSide: "top", slopePct: 0, lengthScale: 1 },
  { id: "r2b", groupId: "middle-1", xOffset: 0, yOffset: 42 - 4,   thickness: 21, color: "var(--ribbon-middle-middle)", opacity: 1, tipSide: "top", slopePct: 0, lengthScale: 1 },
  { id: "r2c", groupId: "middle-1", xOffset: 0, yOffset: 84 - 8,   thickness: 21, color: "var(--ribbon-middle-bottom)", opacity: 1, tipSide: "top", slopePct: 0, lengthScale: 1 },

  { id: "r6a", groupId: "top-3", xOffset: 0, yOffset: 0,           thickness: 24, color: "var(--ribbon-top-top-start)",    color2: "var(--ribbon-top-top-start)",    opacity: 1, tipSide: "top", slopePct: 0, lengthScale: 1.0 },
  { id: "r6b", groupId: "top-3", xOffset: 0, yOffset: 46,          thickness: 24, color: "var(--ribbon-top-middle-start)", color2: "var(--ribbon-top-middle-start)", opacity: 1, tipSide: "top", slopePct: 0, lengthScale: 1 },
  { id: "r6c", groupId: "top-3", xOffset: 0, yOffset: 92,          thickness: 24, color: "var(--ribbon-top-bottom-start)", color2: "var(--ribbon-top-bottom-start)", opacity: 1, tipSide: "top", slopePct: 0, lengthScale: 1 },

  { id: "r5a", groupId: "top-2", xOffset: 0, yOffset: 0,           thickness: 24, color: "var(--ribbon-top-top-end)",    color2: "var(--ribbon-top-top-start)",    opacity: 1, tipSide: "top", slopePct: 0, lengthScale: 1.0 },
  { id: "r5b", groupId: "top-2", xOffset: 0, yOffset: 46,          thickness: 24, color: "var(--ribbon-top-middle-end)", color2: "var(--ribbon-top-middle-start)", opacity: 1, tipSide: "top", slopePct: 0, lengthScale: 1 },
  { id: "r5c", groupId: "top-2", xOffset: 0, yOffset: 92,          thickness: 24, color: "var(--ribbon-top-bottom-end)", color2: "var(--ribbon-top-bottom-start)", opacity: 1, tipSide: "top", slopePct: 0, lengthScale: 1 },

  { id: "r1a", groupId: "top-1", xOffset: 0, yOffset: 0,           thickness: 24, color: "var(--ribbon-top-top-start)",    color2: "var(--ribbon-top-top-end)",    opacity: 1, tipSide: "top", slopePct: 0, lengthScale: 1.0 },
  { id: "r1b", groupId: "top-1", xOffset: 0, yOffset: 46,          thickness: 24, color: "var(--ribbon-top-middle-start)", color2: "var(--ribbon-top-middle-end)", opacity: 1, tipSide: "top", slopePct: 0, lengthScale: 1 },
  { id: "r1c", groupId: "top-1", xOffset: 0, yOffset: 92,          thickness: 24, color: "var(--ribbon-top-bottom-start)", color2: "var(--ribbon-top-bottom-end)", opacity: 1, tipSide: "top", slopePct: 0, lengthScale: 1 },
]

// ─── INTERNAL ────────────────────────────────────────────────────────────────
type ResolvedGroup = Required<Pick<GroupConfig, "anchorX" | "anchorY" | "angle" | "growthRate" | "maxLength">> & {
  triggerOffset: number
  bend?: GroupConfig["bend"]
}

// Flatten a group's mobile overrides on top of its base config, returning a
// fully-resolved record with all optional fields filled in.
const resolveGroup = (g: GroupConfig, isMobile: boolean): ResolvedGroup => {
  const o = isMobile ? g.mobile ?? {} : {}
  return {
    anchorX:       o.anchorX       ?? g.anchorX,
    anchorY:       o.anchorY       ?? g.anchorY,
    angle:         o.angle         ?? g.angle,
    triggerOffset: o.triggerOffset ?? g.triggerOffset ?? 0,
    growthRate:    o.growthRate    ?? g.growthRate,
    maxLength:     o.maxLength     ?? g.maxLength,
    bend:          g.bend,
  }
}

// Stateless length formula. Same scrollY always yields the same length, so
// reloading mid-page and scrolling in either direction are inherently consistent.
const computeLength = (g: ResolvedGroup, r: RibbonConfig, scrollY: number, viewportH: number) => {
  const triggerY = g.anchorY + g.triggerOffset
  const yd = scrollY + viewportH
  const raw = (yd - triggerY) * g.growthRate * r.lengthScale
  const max = g.maxLength * r.lengthScale
  return Math.max(0, Math.min(raw, max))
}

type RibbonEls = { trunk: HTMLDivElement; branch?: HTMLDivElement }

const applyWidth = (
  r: RibbonConfig,
  g: ResolvedGroup,
  totalWidth: number,
  refs: RibbonEls,
) => {
  // Single-segment ribbon (no bend)
  if (!g.bend) {
    refs.trunk.style.width = `${totalWidth}px`
    return
  }

  // Two-segment ribbon: split across trunk and branch at bend.triggerLength
  const threshold = g.bend.triggerLength
  const trunkW = Math.min(totalWidth, threshold)
  const branchW = Math.max(0, totalWidth - threshold)

  refs.trunk.style.width = `${trunkW}px`
  if (refs.branch) refs.branch.style.width = `${branchW}px`

  // Continuous gradient across both segments. Each segment's stops are stretched
  // so the gradient lines up at the joint and reads as one continuous fill.
  if (r.color2 && refs.branch) {
    const T = trunkW + branchW
    if (trunkW > 0 && branchW > 0) {
      refs.trunk.style.background =
        `linear-gradient(to right, ${r.color} 0%, ${r.color2} ${(T / trunkW) * 100}%)`
      refs.branch.style.background =
        `linear-gradient(to right, ${r.color} ${(-trunkW / branchW) * 100}%, ${r.color2} 100%)`
    } else if (trunkW > 0) {
      refs.trunk.style.background = `linear-gradient(to right, ${r.color}, ${r.color2})`
    } else if (branchW > 0) {
      refs.branch.style.background = `linear-gradient(to right, ${r.color}, ${r.color2})`
    }
  }
}

const clipFor = (slopePct: number, tipSide: "top" | "bottom"): string => {
  const s = slopePct * 100
  return tipSide === "top"
    ? `polygon(0 0, 100% 0, ${100 - s}% 100%, 0 100%)`
    : `polygon(0 0, ${100 - s}% 0, 100% 100%, 0 100%)`
}

const groupById = (id: string) => GROUPS.find((g) => g.id === id)!

export default function Ribbons() {
  // `elsRef` is keyed for width/background updates inside applyWidth.
  // `trunkPosRefs` / `branchPosRefs` hold the same elements but are accessed
  // separately during repositioning, which the mobile-overrides path needs.
  const elsRef = useRef<Map<string, RibbonEls>>(new Map())
  const trunkPosRefs = useRef<Map<string, HTMLDivElement>>(new Map())
  const branchPosRefs = useRef<Map<string, HTMLDivElement>>(new Map())

  useEffect(() => {
    const els = elsRef.current
    const trunkPosEls = trunkPosRefs.current
    const branchPosEls = branchPosRefs.current

    const update = () => {
      const scrollY = window.scrollY
      const viewportH = window.innerHeight
      const isMobile = window.innerWidth <= MOBILE_BREAKPOINT

      RIBBONS.forEach((r) => {
        const refs = els.get(r.id)
        if (!refs) return
        const g = resolveGroup(groupById(r.groupId), isMobile)
        const length = computeLength(g, r, scrollY, viewportH)
        applyWidth(r, g, length, refs)

        // Reposition every frame so that crossing the mobile breakpoint (or any
        // future resolved-config change) reflows placement and rotation live.
        const trunkEl = trunkPosEls.get(r.id)
        if (trunkEl) {
          trunkEl.style.left = `calc(${g.anchorX * 100}vw + ${r.xOffset}px)`
          trunkEl.style.top = `${g.anchorY + r.yOffset}px`
          trunkEl.style.transform = `rotate(${g.angle}deg)`
        }
        // Branch sits at the trunk's bend point: offset by `bend.triggerLength`
        // along the trunk's rotation vector.
        const branchEl = branchPosEls.get(r.id)
        if (branchEl && g.bend) {
          const a = (g.angle * Math.PI) / 180
          const dx = g.bend.triggerLength * Math.cos(a)
          const dy = g.bend.triggerLength * Math.sin(a)
          branchEl.style.left = `calc(${g.anchorX * 100}vw + ${r.xOffset}px + ${dx}px)`
          branchEl.style.top = `${g.anchorY + r.yOffset + dy}px`
          branchEl.style.transform = `rotate(${g.bend.angle}deg)`
        }
      })
    }

    update()

    // Coalesce scroll/resize bursts into one update per animation frame.
    let ticking = false
    const onFrame = () => {
      if (ticking) return
      ticking = true
      requestAnimationFrame(() => {
        update()
        ticking = false
      })
    }

    window.addEventListener("scroll", onFrame, { passive: true })
    window.addEventListener("resize", onFrame, { passive: true })
    return () => {
      window.removeEventListener("scroll", onFrame)
      window.removeEventListener("resize", onFrame)
    }
  }, [])

  return (
    <div className="ribbon-layer">
      {RIBBONS.map((r) => {
        const g = groupById(r.groupId)
        const bg = r.color2
          ? `linear-gradient(to right, ${r.color}, ${r.color2})`
          : r.color

        const setTrunk = (el: HTMLDivElement | null) => {
          if (!el) return
          trunkPosRefs.current.set(r.id, el)
          const cur = elsRef.current.get(r.id)
          elsRef.current.set(r.id, { trunk: el, branch: cur?.branch })
        }
        const setBranch = (el: HTMLDivElement | null) => {
          if (!el) return
          branchPosRefs.current.set(r.id, el)
          const cur = elsRef.current.get(r.id)
          if (!cur) return
          elsRef.current.set(r.id, { ...cur, branch: el })
        }

        return (
          <div key={r.id} style={{ display: "contents" }}>
            <div
              ref={setTrunk}
              className="ribbon"
              style={{
                width: 0,
                height: r.thickness,
                background: bg,
                opacity: r.opacity,
                clipPath: g.bend ? "none" : clipFor(r.slopePct, r.tipSide),
              }}
            />
            {g.bend && (
              <div
                ref={setBranch}
                className="ribbon"
                style={{
                  width: 0,
                  height: r.thickness,
                  background: bg,
                  opacity: r.opacity,
                  clipPath: clipFor(r.slopePct, r.tipSide),
                }}
              />
            )}
          </div>
        )
      })}
    </div>
  )
}
