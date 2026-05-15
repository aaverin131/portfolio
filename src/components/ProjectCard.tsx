import { useRef, useState } from "react"
import type { Project } from "../data/projects"

export default function ProjectCard({ project }: { project: Project }) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [videoReady, setVideoReady] = useState(false)
  const hasVideo = Boolean(project.video)

  const handleEnter = () => {
    const v = videoRef.current
    if (!v || !videoReady) return
    v.currentTime = 0
    v.play().catch(() => {})   // browsers can reject autoplay; swallow it
  }
  const handleLeave = () => {
    videoRef.current?.pause()
  }

  return (
    <article
      className="project-card"
      onMouseEnter={hasVideo ? handleEnter : undefined}
      onMouseLeave={hasVideo ? handleLeave : undefined}
    >
      <div className="project-inner">
        <div className="project-media">
          <img src={project.poster} alt={project.title} className="project-poster" />
          {hasVideo && (
            <video
              ref={videoRef}
              src={project.video}
              className={`project-video ${videoReady ? "is-ready" : ""}`}
              muted
              loop
              playsInline
              preload="metadata"
              onCanPlay={() => setVideoReady(true)}
            />
          )}
          {!hasVideo && project.devpost && (
            <a
              className="project-devpost-overlay"
              href={project.devpost}
              target="_blank"
              rel="noreferrer"
              aria-label="Watch demo on Devpost"
            >
              <span>Check out the demo on Devpost →</span>
            </a>
          )}
        </div>
        <div className="project-body">
          <h3 className="project-title">{project.title}</h3>
          <p className="project-blurb">{project.blurb}</p>
          <ul className="project-tech">
            {project.tech.map((t) => <li key={t}>{t}</li>)}
          </ul>
          <div className="project-links">
            {project.repo && (
              <a className="project-link" href={project.repo} target="_blank" rel="noreferrer">
                Code →
              </a>
            )}
            {project.devpost && (
              <a className="project-link" href={project.devpost} target="_blank" rel="noreferrer">
                Devpost →
              </a>
            )}
          </div>
        </div>
      </div>
    </article>
  )
}
