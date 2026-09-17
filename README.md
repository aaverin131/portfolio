# alexanderaverin.dev

My personal site. A single-page portfolio with a scroll-driven ribbon graphics system, built
end to end and deployed on Cloudflare Workers.

**Live:** [alexanderaverin.dev](https://alexanderaverin.dev)

## Stack

| | |
|---|---|
| Language | TypeScript 6 |
| UI | React 19 |
| Build | Vite 8 |
| Styling | Tailwind CSS 4 |
| Animation | GSAP 3, Framer Motion 12 |
| Hosting | Cloudflare Workers (`wrangler`) |
| Lint | ESLint 10, `typescript-eslint`, react-hooks |

## Running it

```bash
npm install
npm run dev        # Vite dev server
npm run build      # tsc -b, then vite build
npm run lint
npm run preview    # build, then serve through the Workers runtime locally
npm run deploy     # build and deploy to Cloudflare
```

`npm run build` type-checks before it bundles, so a type error fails the build rather than
shipping.

## The ribbon system

The diagonal ribbons that grow across the page as you scroll are the only genuinely non-trivial
part of this site, and they are on their second design. The interesting part is why.

**The first version was a state machine.** Each ribbon held a state (dormant, arming, emerging,
grown) and advanced through it in response to scroll events. It looked right when you scrolled
down the page normally, and it broke in two cases:

- **Reloading mid-page.** The browser restores scroll position without replaying the scroll
  events that would have got you there, so every ribbon was still `dormant` at y = 2000 and the
  page rendered empty.
- **Fast up-scrolls.** Scroll events are sampled, not continuous. Flinging the page skipped the
  transitions a ribbon needed to see, leaving it stuck in a state that no longer matched where
  the viewport actually was.

Both bugs had the same cause: the current visual state depended on the *history* of events rather
than on the current scroll position, so a missing or skipped event produced a state that was
internally consistent and wrong. Patching the individual transitions fixed one case and broke the
other.

**The rewrite made ribbon length a pure function of scroll position.** No stored state, no
transitions, nothing to fall out of sync:

```
yd       = scrollY + viewportH          // bottommost visible pixel
triggerY = anchorY + (triggerOffset ?? 0)
length   = clamp(0, (yd - triggerY) * growthRate * lengthScale,
                 maxLength * lengthScale)
```

Same `scrollY` always yields the same length. Reloading at any position computes correctly on the
first frame, because there is no history to be missing. That removed the whole category of bug
instead of the two reported instances. It is implemented as `computeLength()` in
[`src/components/Ribbons.tsx`](src/components/Ribbons.tsx).

### Two things that fall out of that design

**Scroll updates bypass React.** Recomputing 30-odd ribbons through `useState` would re-render
the tree on every scroll frame. Instead a single passive `scroll`/`resize` listener schedules one
`requestAnimationFrame`, which writes transforms and sizes directly to the elements through refs.
React owns the initial tree; the animation loop owns the styles. Shapes themselves are CSS
`clip-path` polygons, so there is no SVG or canvas in the path.

**Visual tuning is data, not code.** Ribbons are declared in two typed config arrays: `GROUPS`
defines the anchor point, angle and growth curve of a cluster, and each ribbon within a group
carries its own thickness, colour, slope and `lengthScale` multiplier. Adjusting the look means
editing a number in a config object, never touching the render loop. Groups can also carry a
`mobile` override block, applied below a 768px breakpoint, which keeps the responsive behaviour
declarative rather than scattered through media queries.

## Everything else

- **`src/components/Reveal.tsx`** wraps a section and fades it in via `IntersectionObserver` with
  a `rootMargin` offset, so the trigger line sits 15% above the viewport bottom rather than
  exactly at the edge. Content stays visible once revealed, and only hides again on scrolling back
  up past the line. One exported constant tunes the offset.
- **`src/data/projects.ts` and `skills.ts`** hold the page content as typed arrays, so adding a
  project is a new object rather than new markup. `Project` models the optional cases explicitly:
  a hover video, a repo link, a Devpost link that swaps the hover video for an overlay.
- **`src/App.tsx`** keeps per-section vertical padding in one `SECTION_PAD` object, passed down as
  CSS custom properties, so page rhythm is adjustable from a single place.

## Deployment

Deployed to Cloudflare Workers through the `@cloudflare/vite-plugin` and `wrangler`.
`not_found_handling` is set to `single-page-application` so client routing resolves, and Workers
observability is enabled. `npm run preview` runs the built output under the real Workers runtime
locally, which catches anything that works in Vite's dev server but not in production.

## Layout

```
src/
  App.tsx              section order and spacing
  main.tsx             React root
  index.css            Tailwind entry and theme tokens
  components/
    Ribbons.tsx        scroll-driven ribbon system
    Reveal.tsx         IntersectionObserver reveal wrapper
    Nav.tsx            side navigation
    Hero.tsx  About.tsx  Projects.tsx  ProjectCard.tsx
    Skills.tsx  Contact.tsx
  data/
    projects.ts        project content
    skills.ts          skill list and logo paths
public/                static assets, resume, social preview image
wrangler.jsonc         Workers configuration
```

## What I would change next

- **No automated tests.** `computeLength()` is a pure function with clear boundary conditions,
  which makes it the obvious first thing to cover, and the two original bugs are straightforward
  to encode as regression cases. That is the next piece of work on this repo.
- **No CI.** Lint and the type-check build should gate pushes rather than relying on me running
  them.
- `SmoothScroll.tsx` is currently a passthrough left over from an abandoned Lenis integration.
  It should either be wired up or removed, along with the unused dependency.
