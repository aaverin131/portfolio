import Reveal from "./Reveal"

export default function Contact() {
  return (
    <section id="contact" className="section">
      <Reveal>
        <h2 className="section-heading">Contact & Links</h2>
        <ul className="contact-list">
          <li>
            <a href="mailto:alexanderaverin7@gmail.com" className="contact-item">
              <img src="/logos/gmail.svg"
                   alt="" className="contact-icon" />
              <span>alexanderaverin7@gmail.com</span>
            </a>
          </li>
          <li>
            <a href="https://www.linkedin.com/in/alexander-averin"
               target="_blank" rel="noreferrer" className="contact-item">
              <img src="/logos/linkedin.svg"
                   alt="" className="contact-icon" />
              <span>linkedin.com/in/alexander-averin</span>
            </a>
          </li>
          <li>
            <a href="https://github.com/aaverin131"
               target="_blank" rel="noreferrer" className="contact-item">
              <img src="/logos/github.svg"
                   alt="" className="contact-icon" />
              <span>github.com/aaverin131</span>
            </a>
          </li>
        </ul>
      </Reveal>
    </section>
  )
}
