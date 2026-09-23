import type { ReactNode } from "react"

// Markdown-style links: "[label](https://…)".
const LINK = /\[([^\]]+)\]\((https?:\/\/[^)\s]+)\)/g

// Plain text, except [label](url) becomes an external link with an icon.
export default function LinkedText({ text }: { text: string }) {
  const parts: ReactNode[] = []
  let last = 0
  for (const m of text.matchAll(LINK)) {
    parts.push(text.slice(last, m.index))
    parts.push(<ExternalLink key={m.index} label={m[1]} href={m[2]} />)
    last = m.index + m[0].length
  }
  parts.push(text.slice(last))
  return <>{parts}</>
}

function ExternalLink({ label, href }: { label: string; href: string }) {
  // Keep the last word and the icon together so the icon never wraps onto a line by itself.
  const cut = label.lastIndexOf(" ") + 1
  return (
    <a className="text-link" href={href} target="_blank" rel="noreferrer">
      {label.slice(0, cut)}
      <span className="text-link-tail">
        {label.slice(cut)}
        <svg className="text-link-icon" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
          <path d="M15 3h6v6" />
          <path d="M10 14 21 3" />
        </svg>
      </span>
      <span className="sr-only"> (opens in a new tab)</span>
    </a>
  )
}
