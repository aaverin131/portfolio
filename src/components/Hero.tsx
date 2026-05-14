import { useEffect, useState } from "react"
import { flushSync } from "react-dom"
import { AnimatePresence, motion } from "framer-motion"

type Pair = { verb: string; noun: string; duration: number }

const pairs: Pair[] = [
  { verb: "build",   noun: "stuff.",                                              duration: 2000 },
  { verb: "make",    noun: "apps.",                                               duration: 2000 },
  { verb: "develop", noun: "games.",                                              duration: 2000 },
  { verb: "program", noun: "robotics.",                                           duration: 2200 },
  { verb: "build",   noun: "things that probably shouldn't work — but do.",       duration: 3800 },
]

const pickDifferent = (current: Pair): Pair => {
  let next = current
  while (next === current) next = pairs[Math.floor(Math.random() * pairs.length)]
  return next
}
const randDir = (): 1 | -1 => (Math.random() > 0.5 ? 1 : -1)

export default function Hero() {
  const [pair, setPair]       = useState<Pair>(pairs[0])
  const [dirVerb, setDirVerb] = useState<1 | -1>(1)
  const [dirNoun, setDirNoun] = useState<1 | -1>(1)

  useEffect(() => {
    const id = setTimeout(() => {
      // Commit the new directions in a flushed render FIRST so the
      // outgoing word re-renders with the matching exit direction.
      flushSync(() => {
        setDirVerb(randDir())
        setDirNoun(randDir())
      })
      // Then trigger the actual swap.
      setPair((prev) => pickDifferent(prev))
    }, pair.duration)
    return () => clearTimeout(id)
  }, [pair])

  return (
    <motion.section
      id="hero"
      className="hero"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.3, duration: 0.5, ease: "easeOut" }}
    >
      <p className="hero-greeting">Hello, I'm</p>
      <h1 className="hero-name">Alexander Averin</h1>
      <p className="hero-tagline">
        I&nbsp;
        <RotatorWord word={pair.verb} dir={dirVerb} variant="verb" />
        &nbsp;
        <RotatorWord word={pair.noun} dir={dirNoun} variant="noun" />
      </p>
    </motion.section>
  )
}

function RotatorWord({ word, dir, variant }: {
  word: string; dir: 1 | -1; variant: "verb" | "noun"
}) {
  return (
    <span className={`rotator rotator-${variant}`}>
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span
          key={word}
          className="rotator-word"
          initial={{ y: dir * 48, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -dir * 48, opacity: 0 }}
          transition={{
            y: { type: "spring", stiffness: 200, damping: 26, mass: 0.9 },
            opacity: { duration: 0.32, ease: "easeOut" },
          }}
        >
          {word}
        </motion.span>
      </AnimatePresence>
    </span>
  )
}