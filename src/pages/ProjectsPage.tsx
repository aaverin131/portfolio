import { useEffect, useState } from "react"
import ProjectCard from "../components/ProjectCard"
import {
  CATEGORIES,
  CATEGORY_LABELS,
  categoryFromSearch,
  categoryQuery,
  projects,
  type Category,
} from "../data/projects"
import { navigationType, scrollToHashTarget } from "../utils/scroll"

// Filter buttons, in order. No value = All.
const FILTERS: { value?: Category; label: string }[] = [
  { label: "All" },
  ...CATEGORIES.map((c) => ({ value: c, label: CATEGORY_LABELS[c] })),
]

export default function ProjectsPage() {
  // Lazy initializer: reads ?category= once, on the first render only.
  const [category, setCategory] = useState(() => categoryFromSearch(window.location.search))

  useEffect(() => {
    document.title = "Projects — Alexander Averin"
    // Arrived from a project page's back link ("/projects#window-slider"): land on that card.
    if (navigationType() === "navigate") scrollToHashTarget()
  }, [])

  const choose = (next?: Category) => {
    setCategory(next)
    // replaceState, not pushState: Back should leave the page, not undo filter clicks.
    history.replaceState(null, "", `/projects${categoryQuery(next)}`)
  }

  const shown = category ? projects.filter((p) => p.category === category) : projects

  return (
    <main className="section page">
      <a className="page-back" href="/#more-projects">← Home</a>
      <h1 className="section-heading">Projects</h1>

      <div className="project-filter" role="group" aria-label="Filter projects">
        {FILTERS.map((f) => (
          <button
            key={f.label}
            type="button"
            className="project-filter-button"
            aria-pressed={category === f.value}
            onClick={() => choose(f.value)}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div className="project-grid">
        {shown.map((p) => (
          <ProjectCard key={p.slug} project={p} query={categoryQuery(category)} />
        ))}
      </div>
    </main>
  )
}
