import { projects } from "../data/projects"
import ProjectCard from "./ProjectCard"
import Reveal from "./Reveal"

const featured = projects.filter((p) => p.featured)

export default function Projects() {
  return (
    <section id="projects" className="section">
      <Reveal>
        <h2 className="section-heading">Projects</h2>
        <div className="project-grid">
          {featured.map((p) => <ProjectCard key={p.slug} project={p} />)}
          <a id="more-projects" className="project-more" href="/projects">
            <span>View more projects</span>
            <span className="project-more-arrow" aria-hidden="true">→</span>
          </a>
        </div>
      </Reveal>
    </section>
  )
}
