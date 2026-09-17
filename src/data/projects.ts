// src/data/projects.ts
export type Project = {
  slug: string
  title: string
  blurb: string
  tech: string[]
  poster: string   // path to static image
  video?: string   // optional hover video
  repo?: string
  live?: string
  devpost?: string // shows a "demo on Devpost" overlay + link in place of hover video
}

export const projects: Project[] = [
  {
    slug: "resume-refiner",
    title: "Resume Refiner",
    blurb: "AI-powered resume optimizer. Hackathon top 10/44 — Led the Flask + Gemini backend.",
    tech: ["Python", "Flask", "React", "Gemini API", "Team of 4"],
    poster: "/media/Resume Refiner thumbnail.png",
    repo: "https://github.com/GDSC-2025-Hackathon/Resume-Refiner",
    devpost: "https://devpost.com/software/resume-refiner",
  },
  {
    slug: "number-string-converter",
    title: "Number ↔ String Converter",
    blurb: "Bidirectional integer/word converter with a modular OOP backend.",
    tech: ["Python", "Flask", "JavaScript"],
    poster: "/media/String Number converter thumbnail.png",
    video: "/media/String Number converter demo.mp4",
    repo: "https://github.com/aaverin131/Python-Projects-Collection/tree/main/number-string-converter",
  },
  {
    slug: "grand-theft-stickman",
    title: "Grand Theft Stickman",
    blurb: "2D open-world game via Pygame engine — OOP architecture, 100+ custom assets, frame-rate-independent motion.",
    tech: ["Python", "Pygame", "pytest", "GitHub Actions"],
    poster: "/media/GTS game thumbnail.png",
    video: "/media/GTS game clip.mp4",
    repo: "https://github.com/aaverin131/Grand-Theft-Stickman",
  },
]