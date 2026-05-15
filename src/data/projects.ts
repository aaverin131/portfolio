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
  {
    slug: "resume-refiner",
    title: "Resume Refiner",
    blurb: "AI-powered resume optimizer. Hackathon top 10/44 — Led the Flask + Gemini backend.",
    tech: ["Python", "Flask", "React", "Gemini API", "Team of 4"],
    poster: "/src/assets/media/Resume Refiner thumbnail.png",
    video: "/src/assets/media/resume-refiner.webm",
    repo: "https://github.com/GDSC-2025-Hackathon/Resume-Refiner",
  },
  {
    slug: "number-string-converter",
    title: "Number ↔ String Converter",
    blurb: "Bidirectional integer/word converter with a modular OOP backend.",
    tech: ["Python", "Flask", "JavaScript"],
    poster: "/src/assets/media/String Number converter thumbnail.png",
    video: "/src/assets/media/String Number converter demo.webm",
    repo: "https://github.com/aaverin131/Number-String-Conversion",
  },
  {
    slug: "grand-theft-stickman",
    title: "Grand Theft Stickman",
    blurb: "2D game engine in Pygame — custom vector physics, 120+ assets, runs smooth.",
    tech: ["Python", "Pygame"],
    poster: "/src/assets/media/GTS game thumbnail.png",
    video: "/src/assets/media/GTS game clip.webm",
    repo: "https://github.com/aaverin131/Grand-Theft-Stickman",
  },
]