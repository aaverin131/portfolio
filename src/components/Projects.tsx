import { projects } from "../data/projects"
import ProjectCard from "./ProjectCard"
import Reveal from "./Reveal"

export default function Projects() {
  return (
    <section id="projects" className="section">
      <Reveal>
        <h2 className="section-heading">Projects</h2>
        <div className="project-grid">
          {projects.map((p) => <ProjectCard key={p.slug} project={p} />)}
        </div>
      </Reveal>
    </section>
  )
}
