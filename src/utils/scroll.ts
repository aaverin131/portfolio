// How the current page load started: "navigate" (a link or a typed URL),
// "reload", or "back_forward".
export function navigationType(): NavigationTimingType | undefined {
  const [entry] = performance.getEntriesByType("navigation") as PerformanceNavigationTiming[]
  return entry?.type
}

// Brings the element named by the URL's #hash to the middle of the screen. Waits for
// web fonts first, because a font swap reflows the text and would shift the target.
export function scrollToHashTarget() {
  const id = decodeURIComponent(window.location.hash.slice(1))
  if (!id) return
  document.fonts.ready.then(() => {
    document.getElementById(id)?.scrollIntoView({ block: "center" })
  })
}
