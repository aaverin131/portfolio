export type Skill = {
  name: string
  logo: string
  category: "language" | "framework" | "tool"
}

const logo = (file: string) => `/logos/${file}`

export const skills: Skill[] = [
  { name: "Python",     category: "language",  logo: logo("python.svg") },
  { name: "C",          category: "language",  logo: logo("c.svg") },
  { name: "Java",       category: "language",  logo: logo("java.svg") },
  { name: "JavaScript", category: "language",  logo: logo("javascript.svg") },
  { name: "TypeScript", category: "language",  logo: logo("typescript.svg") },
  { name: "HTML",       category: "language",  logo: logo("html5.svg") },
  { name: "CSS",        category: "language",  logo: logo("css3.svg") },
  { name: "Bash",       category: "language",  logo: logo("bash.svg") },
  { name: "React",      category: "framework", logo: logo("react.svg") },
  { name: "Tailwind",   category: "framework", logo: logo("tailwindcss.svg") },
  { name: "Flask",      category: "framework", logo: logo("flask.svg") },
  { name: "Docker",     category: "tool",      logo: logo("docker.svg") },
  { name: "Git",        category: "tool",      logo: logo("git.svg") },
  { name: "Vite",       category: "tool",      logo: logo("vite.svg") },
  { name: "VS Code",    category: "tool",      logo: logo("vscode.svg") },
  { name: "Linux",      category: "tool",      logo: logo("linux.svg") },
]
