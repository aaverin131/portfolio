import { useEffect } from "react"
import ProjectLinks from "../components/ProjectLinks"
import { categoryFromSearch, categoryQuery, projects } from "../data/projects"

export default function ProjectDetailPage({ slug }: { slug: string }) {
  const project = projects.find((p) => p.slug === slug)
  // Cards on a filtered list pass their ?category= along, so Back returns to that filter.
  const backHref = `/projects${categoryQuery(categoryFromSearch(window.location.search))}`

  useEffect(() => {
    document.title = `${project?.title ?? "Project not found"} — Alexander Averin`
  }, [project])

  if (!project) {
    return (
      <main className="section page">
        <a className="page-back" href="/projects">← All projects</a>
        <h1 className="section-heading">Project not found</h1>
        <p className="section-body">There's no project at this address.</p>
      </main>
    )
  }

  return (
    <main className="section page">
      <a className="page-back" href={backHref}>← Back to projects</a>
      <h1 className="section-heading">{project.title}</h1>
      <ul className="project-tech">
        {project.tech.map((t) => <li key={t}>{t}</li>)}
      </ul>

      <div className="project-page-media">
        {project.video ? (
          // Plays on its own here, since the card's hover preview never fires on phones.
          <video src={project.video} poster={project.poster} controls autoPlay muted loop playsInline />
        ) : (
          <img src={project.poster} alt={project.title} />
        )}
      </div>

      <p className="section-body">{project.blurb}</p>
      <div className="project-links">
        <ProjectLinks project={project} />
      </div>

      {project.details?.map((d) => (
        <section key={d.heading} className="project-detail">
          <h2 className="project-detail-heading">{d.heading}</h2>
          <p className="section-body">{d.text}</p>
        </section>
      ))}
    </main>
  )
}
