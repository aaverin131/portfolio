import type { Project } from "../data/projects"

// Outbound links, in display order. Each shows only if the project has that field.
const LINKS = [
  { field: "repo",       label: "Code"       },
  { field: "live",       label: "Live"       },
  { field: "devpost",    label: "Devpost"    },
  { field: "makerworld", label: "MakerWorld" },
] as const

export default function ProjectLinks({ project }: { project: Project }) {
  return (
    <>
      {LINKS.map(({ field, label }) =>
        project[field] && (
          <a key={field} className="project-link" href={project[field]} target="_blank" rel="noreferrer">
            {label} →
          </a>
        )
      )}
    </>
  )
}
