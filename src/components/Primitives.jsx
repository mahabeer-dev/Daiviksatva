// Small shared pieces: logo, split-word headings, icons.

export function LotusMark({ className = 'size-8', stroke = false }) {
  const common = stroke
    ? { fill: 'none', stroke: 'currentColor', strokeWidth: 1.2, pathLength: 1, 'data-draw': '' }
    : { fill: 'currentColor' }
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden="true">
      <path {...common} d="M16 4c3.8 4.6 3.8 11.6 0 18-3.8-6.4-3.8-13.4 0-18z" />
      <path {...common} d="M15.3 22.6C10 21.2 6.2 17 5.3 11.6c4.9.6 8.6 4.6 10 11z" />
      <path {...common} d="M16.7 22.6c5.3-1.4 9.1-5.6 10-11-4.9.6-8.6 4.6-10 11z" />
      <path
        d="M7 26.5h18"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        {...(stroke ? { pathLength: 1, 'data-draw': '' } : {})}
      />
    </svg>
  )
}

export function Logo({ className = '' }) {
  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <LotusMark className="size-8 text-saffron" />
      <span className="font-display text-[1.45rem] leading-none tracking-tight">
        Daivik<span className="italic text-saffron">satva</span>
      </span>
    </span>
  )
}

/**
 * Renders text as masked words for GSAP reveals. Screen readers get the
 * plain sentence; the animated words are hidden from them.
 * `parts` is a list of strings or { text, className } objects; '\n' forces a line break.
 */
export function SplitText({ parts, wordClass = '' }) {
  const plain = parts.map((p) => (typeof p === 'string' ? p : p.text)).join(' ').replace(/\s*\n\s*/g, ' ')
  return (
    <>
      <span className="sr-only">{plain}</span>
      <span aria-hidden="true">
        {parts.map((part, i) => {
          const { text, className = '' } = typeof part === 'string' ? { text: part } : part
          if (text === '\n') return <br key={i} />
          return text.split(' ').map((w, j) => (
            <span key={`${i}-${j}`}>
              <span className="split-mask">
                <span className={`split-word ${wordClass} ${className}`} data-word>
                  {w}
                </span>
              </span>{' '}
            </span>
          ))
        })}
      </span>
    </>
  )
}

export const Icon = {
  Arrow: (p) => (
    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" {...p}>
      <path d="M4 10h12m-5-5 5 5-5 5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  Clock: (p) => (
    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" {...p}>
      <circle cx="10" cy="10" r="7.25" />
      <path d="M10 6v4.2l2.6 1.6" strokeLinecap="round" />
    </svg>
  ),
  Pin: (p) => (
    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" {...p}>
      <path d="M10 18s5.5-5.2 5.5-9.5a5.5 5.5 0 0 0-11 0C4.5 12.8 10 18 10 18z" />
      <circle cx="10" cy="8.5" r="2" />
    </svg>
  ),
  Phone: (p) => (
    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" {...p}>
      <path
        d="M5.2 3.5h2.3l1.2 3.2-1.6 1a8.6 8.6 0 0 0 5.2 5.2l1-1.6 3.2 1.2v2.3a1.7 1.7 0 0 1-1.8 1.7C8.7 16 4 11.3 3.5 5.3a1.7 1.7 0 0 1 1.7-1.8z"
        strokeLinejoin="round"
      />
    </svg>
  ),
  Star: (p) => (
    <svg viewBox="0 0 20 20" fill="currentColor" {...p}>
      <path d="m10 1.8 2.5 5.2 5.7.8-4.1 4 1 5.6L10 14.7l-5.1 2.7 1-5.6-4.1-4 5.7-.8z" />
    </svg>
  ),
  Check: (p) => (
    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" {...p}>
      <path d="m5 10.5 3.2 3L15 6.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  Leaf: (p) => (
    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" {...p}>
      <path d="M4 16c0-7 4.5-11.5 12-12-.3 7.6-4.8 12-12 12zm0 0 6-6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  Chat: (p) => (
    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" {...p}>
      <path d="M10 3.2a6.8 6.8 0 0 0-5.9 10.2L3.2 16.8l3.5-.9A6.8 6.8 0 1 0 10 3.2z" strokeLinejoin="round" />
    </svg>
  ),
  Back: (p) => (
    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8" {...p}>
      <path d="M12 4.5 6.5 10l5.5 5.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
}
