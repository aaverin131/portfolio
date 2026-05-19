import type { CSSProperties, ReactNode } from "react"
import SmoothScroll from "./components/SmoothScroll"
import Ribbons from "./components/Ribbons"
import Nav from "./components/Nav"
import Hero from "./components/Hero"
import About from "./components/About"
import Projects from "./components/Projects"
import Skills from "./components/Skills"
import Contact from "./components/Contact"

// Per-section vertical padding. Tweak here to control space between sections.
const SECTION_PAD = {
  about:    { top: "6rem", bottom: "4rem" },
  projects: { top: "0rem", bottom: "6rem" },
  skills:   { top: "9rem", bottom: "6rem" },
  contact:  { top: "0rem", bottom: "6rem" },
} as const

type Pad = { top: string; bottom: string }

function Spacer({ pad, children }: { pad: Pad; children: ReactNode }) {
  return (
    <div
      style={{
        "--section-pad-top": pad.top,
        "--section-pad-bottom": pad.bottom,
      } as CSSProperties}
    >
      {children}
    </div>
  )
}

export default function App() {
  return (
    <SmoothScroll>
      <Nav />
      <main className="relative">
        <Ribbons />
        <div className="relative" style={{ zIndex: 1 }}>
          <Hero />
          <Spacer pad={SECTION_PAD.about}><About /></Spacer>
          <Spacer pad={SECTION_PAD.projects}><Projects /></Spacer>
          <Spacer pad={SECTION_PAD.skills}><Skills /></Spacer>
          <Spacer pad={SECTION_PAD.contact}><Contact /></Spacer>
        </div>
      </main>
    </SmoothScroll>
  )
}
