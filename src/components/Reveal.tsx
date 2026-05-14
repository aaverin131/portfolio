import { useEffect, useRef, useState, type ReactNode, type CSSProperties } from "react"

// Single tunable knob for the scroll reveal.
// % of viewport height the element must climb above the viewport bottom
// before its text reveals. Higher number = reveals deeper into the page.
export const REVEAL_OFFSET_PERCENT = 15

type Props = {
  children: ReactNode
  className?: string
  style?: CSSProperties
}

export default function Reveal({ children, className = "", style }: Props) {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([entry]) => {
        // Reveal once the element's top crosses ABOVE the trigger line, and
        // keep it visible even after it scrolls fully past the viewport top.
        // Only hide if the user scrolls back UP, pushing top below the line.
        const trigger = entry.rootBounds?.bottom ?? window.innerHeight
        setVisible(entry.boundingClientRect.top < trigger)
      },
      { rootMargin: `0px 0px -${REVEAL_OFFSET_PERCENT}% 0px` }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  return (
    <div
      ref={ref}
      className={`reveal${visible ? " is-visible" : ""}${className ? ` ${className}` : ""}`}
      style={style}
    >
      {children}
    </div>
  )
}
