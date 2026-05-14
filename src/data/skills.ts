export type Skill = {
  name: string
  logo: string
  category: "language" | "framework" | "tool"
}

const devicon = (path: string) =>
  `https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/${path}`

export const skills: Skill[] = [
  { name: "Python",     category: "language",  logo: devicon("python/python-original.svg") },
  { name: "C",          category: "language",  logo: devicon("c/c-original.svg") },
  { name: "Java",       category: "language",  logo: devicon("java/java-original.svg") },
  { name: "JavaScript", category: "language",  logo: devicon("javascript/javascript-original.svg") },
  { name: "HTML",       category: "language",  logo: devicon("html5/html5-original.svg") },
  { name: "CSS",        category: "language",  logo: devicon("css3/css3-original.svg") },
  { name: "Bash",       category: "language",  logo: devicon("bash/bash-original.svg") },
  { name: "React",      category: "framework", logo: devicon("react/react-original.svg") },
  { name: "Flask",      category: "framework", logo: devicon("flask/flask-original.svg") },
  { name: "Docker",     category: "tool",      logo: devicon("docker/docker-original.svg") },
  { name: "Git",        category: "tool",      logo: devicon("git/git-original.svg") },
  { name: "VS Code",    category: "tool",      logo: devicon("vscode/vscode-original.svg") },
  { name: "Linux",      category: "tool",      logo: devicon("linux/linux-original.svg") },
]