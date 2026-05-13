import SmoothScroll from "./components/SmoothScroll"
import Ribbons from "./components/Ribbons"
import Hero from "./components/Hero"
import About from "./components/About"
import Projects from "./components/Projects"
import Skills from "./components/Skills"
import Contact from "./components/Contact"

export default function App() {
  return (
    <SmoothScroll>
      <Ribbons />
      <main className="relative">
        <Hero />
        <About />
        <Projects />
        <Skills />
        <Contact />
      </main>
    </SmoothScroll>
  )
}