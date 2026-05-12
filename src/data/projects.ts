// src/data/projects.ts
export type Project = {
  slug: string
  title: string
  blurb: string
  tech: string[]
  poster: string   // path to static image
  video: string    // path to hover video
  repo?: string
  live?: string
}

export const projects: Project[] = [
  { slug: "resume-refiner", ... },
  ...
]