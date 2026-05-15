import { useEffect, useState, type MouseEvent } from "react"

const LINKS = [
  { href: "#hero",    label: "top"    },
  { href: "#about",    label: "about"    },
  { href: "#projects", label: "projects" },
  { href: "#skills",   label: "skills"   },
  { href: "#contact",  label: "contact"  },
]

// Fraction of viewport height the user must scroll past before the nav opens.
const OPEN_THRESHOLD = 0.8

const ICON_ON  = "/UI/light-bulb-on-svgrepo-com.svg"
const ICON_OFF = "/UI/light-bulb-off-svgrepo-com.svg"

export default function Nav() {
  const [open, setOpen]       = useState(true)
  // Always start dark (bulb off), regardless of OS preference.
  const [themeOn, setThemeOn] = useState(false)

  useEffect(() => {
    // Bulb OFF = dark theme. Flip a class on <html> so global CSS can react.
    document.documentElement.classList.toggle("theme-dark", !themeOn)
  }, [themeOn])

  useEffect(() => {
    // No localStorage on purpose — resets on reload.
    const onScroll = () => {
      if (window.scrollY > window.innerHeight * OPEN_THRESHOLD) {
        setOpen(true)
        window.removeEventListener("scroll", onScroll)
      }
    }
    window.addEventListener("scroll", onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  useEffect(() => {
    // If a hash survived from a previous visit, start at the top on reload
    // instead of teleporting to that section.
    if (window.location.hash) {
      history.replaceState(null, "", window.location.pathname + window.location.search)
      window.scrollTo(0, 0)
    }
  }, [])

  const handleNavClick = (e: MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault()
    const target = document.querySelector(href)
    if (target) target.scrollIntoView({ behavior: "smooth", block: "start" })
  }

  return (
    <nav className={`side-nav${open ? " is-open" : ""}`} aria-label="Sections">
      <span className="side-nav-rule" aria-hidden="true" />
      <ul className="side-nav-list">
        {LINKS.map((l) => (
          <li key={l.href}>
            <a
              href={l.href}
              className="side-nav-link"
              onClick={(e) => handleNavClick(e, l.href)}
            >
              {l.label}
            </a>
          </li>
        ))}
        <li>
          <button
            type="button"
            className={`side-nav-theme${themeOn ? " is-on" : ""}`}
            aria-label="Switch theme"
            aria-pressed={themeOn}
            onClick={() => setThemeOn((v) => !v)}
          >
            <img
              className="side-nav-theme-icon"
              src={themeOn ? ICON_ON : ICON_OFF}
              alt=""
            />
          </button>
        </li>
      </ul>
    </nav>
  )
}
