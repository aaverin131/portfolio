import { skills } from "../data/skills"
import Reveal from "./Reveal"

const groups = [
  { title: "Languages",  category: "language"  as const },
  { title: "Frameworks", category: "framework" as const },
  { title: "Tools",      category: "tool"      as const },
]

export default function Skills() {
  return (
    <section id="skills" className="section">
      <Reveal>
        <h2 className="section-heading">My Skillset</h2>
        {groups.map((g) => (
          <div key={g.category} className="skill-group">
            <h3 className="skill-group-title">{g.title}</h3>
            <ul className="skill-grid">
              {skills
                .filter((s) => s.category === g.category)
                .map((s) => (
                  <li key={s.name} className="skill-item" data-name={s.name}>
                      <img src={s.logo} alt={s.name} className="skill-icon" />
                  </li>
                ))}
            </ul>
          </div>
        ))}
      </Reveal>
    </section>
  )
}
