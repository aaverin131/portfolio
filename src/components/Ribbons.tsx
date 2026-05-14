import { useEffect, useRef } from "react"
import gsap from "gsap"

// ─── CONFIG TYPES ────────────────────────────────────────────────────────────
type GroupConfig = {
  id: string
  anchorX: number          // 0..1 — fraction of viewport width. 0 = left edge, 0.5 = center, 1 = right edge
  anchorY: number          // px from top of <main> (document coord)
  angle: number            // degrees, 2D rotation in the screen plane.
                           // 0 = →, 25 = ↘, 155 = ↙, -25 = ↗
  emerge: { duration: number; ease: string; delay?: number }
  scrollGrowthRate: number       // extra width-multiplier per scroll px past anchor
  maxLengthScale: number    // Cap on extension. 1 = can't grow past base, 2 = can double, etc.
  armOffset: number        // px below viewport — dormant if anchor is farther than this
  targetLengthVh: number   // emerged length as fraction of viewport height
  bend?: {
    triggerLengthScale: number   // multiplier on baseLength. At this width, bend kicks in.
                                 // 1.0 = bend right at emerge end. 1.5 = bend after growing 50% past base.
    angle: number                // absolute angle (degrees) of the second segment
  }
}

type RibbonConfig = {
  id: string
  groupId: string
  yOffset: number
  xOffset: number
  thickness: number
  color: string
  color2?: string 
  opacity: number
  tipSide: "top" | "bottom"
  slopePct: number
  lengthScale: number      // ← NEW. 1 = group default, <1 shorter, >1 longer
}

// ─── EDIT THESE ──────────────────────────────────────────────────────────────
const GROUPS: GroupConfig[] = [
    {
      id: "bottom-1",
      anchorX: 1,
      anchorY: 500,
      angle: 158,
      emerge: { duration: 1.4, ease: "power2.out" },
      scrollGrowthRate: 0.0016,
      maxLengthScale: 4.5,
      armOffset: 400,
      targetLengthVh: 1,
    },
    {
      id: "bottom-2",
      anchorX: -0.3,
      anchorY: 1350,
      angle: 22,
      emerge: { duration: 1.4, ease: "power2.out"},
      scrollGrowthRate: 0.0016,
      maxLengthScale: 4.5,
      armOffset: 100,
      targetLengthVh: 1,
    },
    {
    id: "middle-1",
    anchorX: 1,
    anchorY: 0,
    angle: 170,
    emerge: { duration: 1.4, ease: "power2.out" },
    scrollGrowthRate: 0.0000,
    maxLengthScale: 2.5,
    armOffset: 400,
    targetLengthVh: 2.0,
  },
  {
    id: "middle-2",
    anchorX: 0,
    anchorY: 500,
    angle: 30,
    emerge: { duration: 1.4, ease: "power2.out" },
    scrollGrowthRate: 0.0026,
    maxLengthScale: 4.5,
    armOffset: 400,
    targetLengthVh: 0.7,
  },
  {
    id: "middle-3",
    anchorX: 1.1,
    anchorY: 1700,
    angle: 150,
    emerge: { duration: 1.4, ease: "power2.out" },
    scrollGrowthRate: 0.0026,
    maxLengthScale: 4.5,
    armOffset: 400,
    targetLengthVh: 0.1,
  },
  {
    id: "top-1",
    anchorX: 0.1,
    anchorY: -110,
    angle: 30,
    emerge: { duration: 1.2, ease: "power2.out", delay: 0.1 },
    scrollGrowthRate: 0.005,
    maxLengthScale: 1,
    armOffset: 400,
    targetLengthVh: 2.0,
  },
  {
    id: "top-2",
    anchorX: 1.1,
    anchorY: 1000,
    angle: 150,
    emerge: { duration: 1.2, ease: "power2.out", delay: 0.1 },
    scrollGrowthRate: 0.015,
    maxLengthScale: 25,
    armOffset: 400,
    targetLengthVh: 0.1,
    bend: { triggerLengthScale: 15.0, angle: 180 },
  },
  {
    id: "top-3",
    anchorX: -0.2,
    anchorY: 3250,
    angle: 0,
    emerge: { duration: 1.2, ease: "power2.out",},
    scrollGrowthRate: 0.004,
    maxLengthScale: 20,
    armOffset: 400,
    targetLengthVh: 1,
  },
]

const RIBBONS: RibbonConfig[] = [
    
    { id: "r4a", groupId: "bottom-1", xOffset: 0, yOffset: 0,  thickness: 17,  color: "var(--ribbon-bottom-top)",       opacity: 0.7, tipSide: "top",    slopePct: 0, lengthScale: 1.2 },
    { id: "r4b", groupId: "bottom-1", xOffset: 0, yOffset: 42 - 10, thickness: 17,  color: "var(--ribbon-bottom-middle)",    opacity: 0.7, tipSide: "top",    slopePct: 0, lengthScale: 1.1 },
    { id: "r4c", groupId: "bottom-1", xOffset: 0, yOffset: 84 - 10*2, thickness: 17,  color: "var(--ribbon-bottom-bottom)",    opacity: 0.7, tipSide: "top",    slopePct: 0, lengthScale: 1 },

    { id: "r7a", groupId: "bottom-2", xOffset: 0, yOffset: 0,  thickness: 17,  color: "var(--ribbon-bottom-top)",       opacity: 0.7, tipSide: "top",    slopePct: 0, lengthScale: 1.2 },
    { id: "r7b", groupId: "bottom-2", xOffset: 0, yOffset: 42 - 10, thickness: 17,  color: "var(--ribbon-bottom-middle)",    opacity: 0.7, tipSide: "top",    slopePct: 0, lengthScale: 1.1 },
    { id: "r7c", groupId: "bottom-2", xOffset: 0, yOffset: 84 - 10*2, thickness: 17,  color: "var(--ribbon-bottom-bottom)",    opacity: 0.7, tipSide: "top",    slopePct: 0, lengthScale: 1 },
    
    { id: "r8a", groupId: "middle-3", xOffset: 0, yOffset: 0,  thickness: 21,  color: "var(--ribbon-middle-top)",       opacity: 1, tipSide: "top",    slopePct: 0, lengthScale: 1.2 },
    { id: "r8b", groupId: "middle-3", xOffset: 0, yOffset: 42 - 0, thickness: 21,  color: "var(--ribbon-middle-middle)",    opacity: 1, tipSide: "top",    slopePct: 0, lengthScale: 1.1 },
    { id: "r8c", groupId: "middle-3", xOffset: 0, yOffset: 84 - 6, thickness: 21,  color: "var(--ribbon-middle-bottom)",    opacity: 1, tipSide: "top",    slopePct: 0, lengthScale: 1 },

    { id: "r3a", groupId: "middle-2", xOffset: 0, yOffset: 0,  thickness: 21,  color: "var(--ribbon-middle-top)",       opacity: 1, tipSide: "top",    slopePct: 0, lengthScale: 1.2 },
    { id: "r3b", groupId: "middle-2", xOffset: 0, yOffset: 42 - 0, thickness: 21,  color: "var(--ribbon-middle-middle)",    opacity: 1, tipSide: "top",    slopePct: 0, lengthScale: 1.1 },
    { id: "r3c", groupId: "middle-2", xOffset: 0, yOffset: 84 - 6, thickness: 21,  color: "var(--ribbon-middle-bottom)",    opacity: 1, tipSide: "top",    slopePct: 0, lengthScale: 1 },

    { id: "r2a", groupId: "middle-1", xOffset: 0, yOffset: 0,  thickness: 21,  color: "var(--ribbon-middle-top)",       opacity: 1, tipSide: "top",    slopePct: 0, lengthScale: 1 },
    { id: "r2b", groupId: "middle-1", xOffset: 0, yOffset: 42 - 4, thickness: 21,  color: "var(--ribbon-middle-middle)",    opacity: 1, tipSide: "top",    slopePct: 0, lengthScale: 1 },
    { id: "r2c", groupId: "middle-1", xOffset: 0, yOffset: 84 - 4*2, thickness: 21,  color: "var(--ribbon-middle-bottom)",    opacity: 1, tipSide: "top",    slopePct: 0, lengthScale: 1 },
    
    { id: "r6a", groupId: "top-3", xOffset: 0, yOffset: 0,  thickness: 24, color: "var(--ribbon-top-top-start)", color2: "var(--ribbon-top-top-start)", opacity: 1, tipSide: "top", slopePct: 0, lengthScale: 1.0 },
    { id: "r6b", groupId: "top-3", xOffset: 0, yOffset: 46, thickness: 24, color: "var(--ribbon-top-middle-start)", color2: "var(--ribbon-top-middle-start)", opacity: 1, tipSide: "top", slopePct: 0, lengthScale: 1 },
    { id: "r6c", groupId: "top-3", xOffset: 0, yOffset: 92, thickness: 24, color: "var(--ribbon-top-bottom-start)", color2: "var(--ribbon-top-bottom-start)", opacity: 1, tipSide: "top", slopePct: 0, lengthScale: 1 },

    { id: "r5a", groupId: "top-2", xOffset: 0, yOffset: 0,  thickness: 24, color: "var(--ribbon-top-top-end)", color2: "var(--ribbon-top-top-start)", opacity: 1, tipSide: "top", slopePct: 0, lengthScale: 1.0 },
    { id: "r5b", groupId: "top-2", xOffset: 0, yOffset: 46, thickness: 24, color: "var(--ribbon-top-middle-end)", color2: "var(--ribbon-top-middle-start)", opacity: 1, tipSide: "top", slopePct: 0, lengthScale: 1 },
    { id: "r5c", groupId: "top-2", xOffset: 0, yOffset: 92, thickness: 24, color: "var(--ribbon-top-bottom-end)", color2: "var(--ribbon-top-bottom-start)", opacity: 1, tipSide: "top", slopePct: 0, lengthScale: 1 },

    { id: "r1a", groupId: "top-1", xOffset: 0, yOffset: 0,  thickness: 24, color: "var(--ribbon-top-top-start)", color2: "var(--ribbon-top-top-end)", opacity: 1, tipSide: "top", slopePct: 0, lengthScale: 1.0 },
    { id: "r1b", groupId: "top-1", xOffset: 0, yOffset: 46, thickness: 24, color: "var(--ribbon-top-middle-start)", color2: "var(--ribbon-top-middle-end)", opacity: 1, tipSide: "top", slopePct: 0, lengthScale: 1 },
    { id: "r1c", groupId: "top-1", xOffset: 0, yOffset: 92, thickness: 24, color: "var(--ribbon-top-bottom-start)", color2: "var(--ribbon-top-bottom-end)", opacity: 1, tipSide: "top", slopePct: 0, lengthScale: 1 },
]

// ─── INTERNAL ────────────────────────────────────────────────────────────────
type RibbonState = "dormant" | "emerging" | "active"

const groupById = (id: string) => GROUPS.find((g) => g.id === id)!

// Double source of truth for "how long should this ribbon be at scroll Y?"
// Both emerge target and active updates use this — eliminates the handoff jump.
const baseLengthPx = (r: RibbonConfig, viewportH: number): number => {
  const g = groupById(r.groupId)
  return g.targetLengthVh * r.lengthScale * viewportH
}

const activeWidth = (r: RibbonConfig, scrollY: number, refScrollY: number, viewportH: number): number => {
  const g = groupById(r.groupId)
  const base = baseLengthPx(r, viewportH)
  const delta = scrollY - refScrollY
  const grown = base * (1 + delta * g.scrollGrowthRate)
  const max = base * g.maxLengthScale
  return Math.max(0, Math.min(grown, max))
}

const applyWidth = (
  r: RibbonConfig,
  totalWidth: number,
  els: Map<string, RibbonEls>,
  viewportH: number,
) => {
  const refs = els.get(r.id)
  if (!refs) return
  const g = groupById(r.groupId)

  // ── Single-segment ribbon (no bend) ──────────────────────────────
  if (!g.bend) {
    refs.trunk.style.width = `${totalWidth}px`
    return
  }

  // ── Two-segment ribbon: split total across trunk and branch ──────
  const threshold = g.targetLengthVh * g.bend.triggerLengthScale * viewportH
  const trunkW = Math.min(totalWidth, threshold)
  const branchW = Math.max(0, totalWidth - threshold)

  refs.trunk.style.width = `${trunkW}px`
  if (refs.branch) refs.branch.style.width = `${branchW}px`

  // ── Continuous gradient across both segments ─────────────────────
  if (r.color2 && refs.branch) {
    const T = trunkW + branchW
    if (trunkW > 0 && branchW > 0) {
      // Both visible — stretch each segment's stops so they line up at the joint
      refs.trunk.style.background =
        `linear-gradient(to right, ${r.color} 0%, ${r.color2} ${(T / trunkW) * 100}%)`
      refs.branch.style.background =
        `linear-gradient(to right, ${r.color} ${(-trunkW / branchW) * 100}%, ${r.color2} 100%)`
    } else if (trunkW > 0) {
      // Only trunk visible — give it the full gradient
      refs.trunk.style.background = `linear-gradient(to right, ${r.color}, ${r.color2})`
    } else if (branchW > 0) {
      // Only branch visible (edge case — would only happen if threshold = 0)
      refs.branch.style.background = `linear-gradient(to right, ${r.color}, ${r.color2})`
    }
  }
}

const clipFor = (slopePct: number, tipSide: "top" | "bottom"): string => {
  const s = slopePct * 100
  // Right trapezoid. Tip is the sharp corner at top-right or bottom-right.
  return tipSide === "top"
    ? `polygon(0 0, 100% 0, ${100 - s}% 100%, 0 100%)`
    : `polygon(0 0, ${100 - s}% 0, 100% 100%, 0 100%)`
}

export default function Ribbons() {
  type RibbonEls = { trunk: HTMLDivElement; branch?: HTMLDivElement }
  const elsRef = useRef<Map<string, RibbonEls>>(new Map())
  const statesRef = useRef<Map<string, RibbonState>>(new Map())
  const scrollRefsRef = useRef<Map<string, number>>(new Map())

  useEffect(() => {
    const els = elsRef.current
    const states = statesRef.current
    const scrollRefs = scrollRefsRef.current

    RIBBONS.forEach((r) => states.set(r.id, "dormant"))

    const emerge = (r: RibbonConfig) => {
        const refs = els.get(r.id)
        if (!refs) return
        const g = groupById(r.groupId)
        states.set(r.id, "emerging")
        const target = baseLengthPx(r, window.innerHeight)
        const obj = { length: 0 }
        gsap.to(obj, {
            length: target,
            duration: g.emerge.duration,
            ease: g.emerge.ease,
            delay: g.emerge.delay ?? 0,
            onUpdate: () => applyWidth(r, obj.length, els, window.innerHeight),
            onComplete: () => {
            scrollRefs.set(r.id, window.scrollY)
            states.set(r.id, "active")
            },
        })
    }

    const update = () => {
    const scrollY = window.scrollY
    const viewportH = window.innerHeight
    const viewportBottom = scrollY + viewportH

    RIBBONS.forEach((r) => {
        const g = groupById(r.groupId)
        const refs = els.get(r.id)
        if (!refs) return
        const anchorY = g.anchorY + r.yOffset
        const state = states.get(r.id)

        if (state === "dormant" && anchorY < viewportBottom + g.armOffset) {
        emerge(r)
        } else if (state === "active") {
        const ref = scrollRefs.get(r.id) ?? scrollY
        applyWidth(r, activeWidth(r, scrollY, ref, viewportH), els, viewportH)
        }
    })
    }

  update()

  let ticking = false
  const onScroll = () => {
    if (ticking) return
    ticking = true
    requestAnimationFrame(() => {
      update()
      ticking = false
    })
  }

  window.addEventListener("scroll", onScroll, { passive: true })
  window.addEventListener("resize", onScroll, { passive: true })
  return () => {
    window.removeEventListener("scroll", onScroll)
    window.removeEventListener("resize", onScroll)
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
        const cur = elsRef.current.get(r.id)
        elsRef.current.set(r.id, { trunk: el, branch: cur?.branch })
      }
      const setBranch = (el: HTMLDivElement | null) => {
        if (!el) return
        const cur = elsRef.current.get(r.id)
        if (!cur) return
        elsRef.current.set(r.id, { ...cur, branch: el })
      }

      // Branch sits at the end of the trunk's bend threshold.
      // Threshold in vh: targetLengthVh × triggerScale × 100
      // Offset = threshold × (cos, sin) of trunk angle.
      const thresholdVh =
        g.bend ? g.targetLengthVh * g.bend.triggerLengthScale * 100 : 0
      const a = (g.angle * Math.PI) / 180
      const dxVh = thresholdVh * Math.cos(a)
      const dyVh = thresholdVh * Math.sin(a)

      return (
        <div key={r.id} style={{ display: "contents" }}>
          {/* trunk */}
          <div
            ref={setTrunk}
            className="ribbon"
            style={{
              left: `calc(${g.anchorX * 100}vw + ${r.xOffset}px)`,
              top: g.anchorY + r.yOffset,
              width: 0,
              height: r.thickness,
              background: bg,
              opacity: r.opacity,
              transform: `rotate(${g.angle}deg)`,
              // If there's a bend, trunk has a square end (the tip lives on the branch)
              clipPath: g.bend ? "none" : clipFor(r.slopePct, r.tipSide),
            }}
          />
          {/* branch — only rendered when the group has a bend */}
          {g.bend && (
            <div
              ref={setBranch}
              className="ribbon"
              style={{
                left: `calc(${g.anchorX * 100}vw + ${r.xOffset}px + ${dxVh}vh)`,
                top: `calc(${g.anchorY + r.yOffset}px + ${dyVh}vh)`,
                width: 0,
                height: r.thickness,
                background: bg,
                opacity: r.opacity,
                transform: `rotate(${g.bend.angle}deg)`,
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