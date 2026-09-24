// src/data/projects.ts
export type Project = {
  slug: string     // also the page URL: /projects/<slug>
  title: string
  blurb: string
  tech: string[]
  poster: string   // path to static image
  video?: string   // optional hover video
  repo?: string
  live?: string
  devpost?: string // shows a "demo on Devpost" overlay + link in place of hover video
  makerworld?: string
  category: Category   // required: which filter it belongs to
  featured?: boolean   // true = shows on the home grid
  details?: Detail[]   // extra sections on the project's own page
}

export type Detail = {
  heading: string
  text: string   // "[label](https://…)" renders as an external link with an icon
  images?: { src: string; alt: string }[]   // shown side by side under the text, as a collage
}

// Types disappear at runtime, so the categories live in a real array and the
// type is derived from it — checking a ?category= value from the URL needs the array.
export const CATEGORIES = ["software", "embed-modelling"] as const
export type Category = (typeof CATEGORIES)[number]

export const CATEGORY_LABELS: Record<Category, string> = {
  software: "Software",
  "embed-modelling": "Embedded + 3D",
}

// "?category=embed-modelling" → "embed-modelling". Missing or unknown values give
// undefined (= all projects), so a mistyped link still shows everything.
export function categoryFromSearch(search: string): Category | undefined {
  const value = new URLSearchParams(search).get("category")
  return CATEGORIES.find((c) => c === value)
}

// The reverse, for building links: undefined → "" (no filter).
export function categoryQuery(category?: Category): string {
  return category ? `?category=${category}` : ""
}

export const projects: Project[] = [
  {
    category: "software",
    featured: true,
    slug: "resume-refiner",
    title: "Resume Refiner",
    blurb: "AI-powered resume optimizer. Hackathon top 10/44 — Built the Flask + Gemini backend.",
    tech: ["Python", "Flask", "React", "Gemini API", "Team of 4"],
    poster: "/media/resume-refiner/Resume Refiner thumbnail.png",
    repo: "https://github.com/GDSC-2025-Hackathon/Resume-Refiner",
    devpost: "https://devpost.com/software/resume-refiner",
  },
  {
    category: "software",
    featured: true,
    slug: "number-string-converter",
    title: "Number ↔ String Converter",
    blurb: "Bidirectional integer/word converter with a modular OOP backend.",
    tech: ["Python", "Flask", "JavaScript"],
    poster: "/media/number-string-converter/String Number converter thumbnail.png",
    video: "/media/number-string-converter/String Number converter demo.mp4",
    repo: "https://github.com/aaverin131/Python-Projects-Collection/tree/main/number-string-converter",
  },
  {
    category: "software",
    featured: true,
    slug: "grand-theft-stickman",
    title: "Grand Theft Stickman",
    blurb: "2D open-world game via Pygame engine — OOP architecture, 100+ custom assets, frame-rate-independent motion.",
    tech: ["Python", "Pygame", "pytest", "GitHub Actions"],
    poster: "/media/grand-theft-stickman/GTS game thumbnail.png",
    video: "/media/grand-theft-stickman/GTS game clip.mp4",
    repo: "https://github.com/aaverin131/Grand-Theft-Stickman",
  },
  {
    category: "embed-modelling",
    slug: "window-slider",
    title: "Automatic Window Slider",
    blurb: "Opens and closes a window from a TV remote. An ESP32 reads the IR signal and drives a NEMA 17 stepper; I modelled the parts in Fusion 360 and printed them. Next: Wi-Fi control.",
    tech: ["ESP32", "NEMA 17", "IR", "Fusion 360", "3D Printing"],
    poster: "/media/window-slider/Window Slider thumbnail.jpg",
  },
  {
    category: "embed-modelling",
    slug: "silver-robotics-logo",
    title: "Silver Robotics Logo",
    blurb: "My FRC team's logo (Team 9575) as a 3D print, with a CNC arm that moves the S up and down like it's building the letter. Modelled in Fusion 360.",
    tech: ["Fusion 360", "3D Printing"],
    poster: "/media/silver-robotics-logo/Silver Robotics logo.png",
    video: "/media/silver-robotics-logo/Logo demo.mp4",
    details: [
      {
        heading: "The print run",
        text: "I printed roughly 150 of these on my Bambu Lab P1S, with the AMS 2 Pro switching filaments for the colours. They went out as free team merch at the [2026 FIRST Ontario Provincial Championship](https://firstroboticscanada.org/frc/championship/).",
        images: [
          { src: "/media/silver-robotics-logo/Free logo givaway.jpg", alt: "A box of printed logos labelled 9575 MERCH and FREE" },
          { src: "/media/silver-robotics-logo/Photogenic logo line-up.jpg", alt: "A row of printed Silver Robotics logos lined up on a desk" },
        ],
      },
    ],
  },
]