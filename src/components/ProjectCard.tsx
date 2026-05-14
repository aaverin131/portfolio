import { useRef, useState } from "react"
import type { Project } from "../data/projects"

export default function ProjectCard({ project }: { project: Project }) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [videoReady, setVideoReady] = useState(false)

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
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
    >
      <div className="project-inner">
        <div className="project-media">
          <img src={project.poster} alt={project.title} className="project-poster" />
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
        </div>
        <div className="project-body">
          <h3 className="project-title">{project.title}</h3>
          <p className="project-blurb">{project.blurb}</p>
          <ul className="project-tech">
            {project.tech.map((t) => <li key={t}>{t}</li>)}
          </ul>
          {project.repo && (
            <a className="project-link" href={project.repo} target="_blank" rel="noreferrer">
              Code →
            </a>
          )}
        </div>
      </div>
    </article>
  )
}