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