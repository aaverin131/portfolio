import Reveal from "./Reveal"

export default function About() {
  return (
    <section id="about" className="section">
      <Reveal>
        <h2 className="section-heading">About me</h2>
        <p className="section-body">
          Sophomore Computer Science student @ the University of Guelph.
          Why CS? It opens up a range of things I love to do — apps,
          robotics, and making games.
        </p>
      </Reveal>
    </section>
  )
}
