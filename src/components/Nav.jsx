import { useLayoutEffect, useRef, useState } from 'react'
import { gsap, ScrollTrigger, MOTION_OK, scrollToTarget } from '../lib/motion'
import { Icon, Logo } from './Primitives'

const LINKS = [
  { label: 'Treatments', href: '#treatments' },
  { label: 'Your journey', href: '#journey' },
  { label: 'Doctors', href: '#doctors' },
  { label: 'Reviews', href: '#reviews' },
  { label: 'Visit us', href: '#visit' },
]

export default function Nav({ ready }) {
  const root = useRef(null)
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useLayoutEffect(() => {
    const st = ScrollTrigger.create({
      start: 40,
      end: 'max',
      onToggle: (self) => setScrolled(self.isActive),
    })
    return () => st.kill()
  }, [])

  useLayoutEffect(() => {
    const mm = gsap.matchMedia(root)
    mm.add(MOTION_OK, () => {
      if (!ready) {
        gsap.set(root.current, { yPercent: -120 })
        return
      }
      // Clear the transform afterwards so the fixed mobile menu is sized to the viewport.
      gsap.fromTo(root.current, { yPercent: -120 }, {
        yPercent: 0,
        duration: 1.1,
        delay: 0.5,
        ease: 'power4.out',
        clearProps: 'transform',
      })
    })
    return () => mm.revert()
  }, [ready])

  const go = (e, href) => {
    e.preventDefault()
    setOpen(false)
    scrollToTarget(href)
  }

  return (
    <header ref={root} className="fixed inset-x-0 top-0 z-50 px-4 pt-3 md:px-6 md:pt-4">
      <nav
        className={`mx-auto flex max-w-7xl items-center justify-between rounded-full px-4 py-2.5 transition-all duration-500 md:px-6 ${
          scrolled ? 'glass' : 'border border-transparent'
        }`}
        aria-label="Main"
      >
        <a href="#top" onClick={(e) => go(e, '#top')} aria-label="Daiviksatva home">
          <Logo />
        </a>

        <ul className="hidden items-center gap-8 text-sm font-medium text-ink/75 lg:flex">
          {LINKS.map((l) => (
            <li key={l.href}>
              <a
                href={l.href}
                onClick={(e) => go(e, l.href)}
                className="group relative py-1 transition-colors hover:text-ink"
              >
                {l.label}
                <span className="absolute inset-x-0 -bottom-0.5 h-px origin-left scale-x-0 bg-saffron transition-transform duration-500 group-hover:scale-x-100" />
              </a>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-2">
          <a
            href="#book"
            onClick={(e) => go(e, '#book')}
            className="hidden items-center gap-2 rounded-full bg-forest px-5 py-2.5 text-sm font-semibold text-cream transition-colors hover:bg-forest-deep sm:inline-flex"
          >
            Book a consultation
            <Icon.Arrow className="size-4" />
          </a>
          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            className="grid size-11 place-items-center rounded-full lg:hidden"
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? 'Close menu' : 'Open menu'}
          >
            <span className="relative block h-3 w-6">
              <span
                className={`absolute left-0 top-0 h-[1.5px] w-full bg-ink transition-transform duration-500 ${open ? 'translate-y-[5px] rotate-45' : ''}`}
              />
              <span
                className={`absolute bottom-0 left-0 h-[1.5px] w-full bg-ink transition-transform duration-500 ${open ? '-translate-y-[5.5px] -rotate-45' : ''}`}
              />
            </span>
          </button>
        </div>
      </nav>

      <div
        id="mobile-menu"
        className={`fixed inset-0 -z-10 flex flex-col justify-between bg-cream px-6 pb-10 pt-28 transition-[clip-path] duration-700 ease-[cubic-bezier(.76,0,.24,1)] lg:hidden ${
          open ? '[clip-path:inset(0_0_0_0)]' : 'pointer-events-none [clip-path:inset(0_0_100%_0)]'
        }`}
      >
        <ul className="space-y-2">
          {LINKS.map((l, i) => (
            <li key={l.href} className="overflow-hidden">
              <a
                href={l.href}
                onClick={(e) => go(e, l.href)}
                style={{ transitionDelay: open ? `${150 + i * 60}ms` : '0ms' }}
                className={`flex items-baseline gap-4 font-display text-4xl transition-transform duration-700 ease-[cubic-bezier(.22,1,.36,1)] ${
                  open ? 'translate-y-0' : 'translate-y-full'
                }`}
              >
                <span className="font-sans text-xs text-saffron">0{i + 1}</span>
                {l.label}
              </a>
            </li>
          ))}
        </ul>
        <a
          href="#book"
          onClick={(e) => go(e, '#book')}
          className="inline-flex items-center justify-center gap-2 rounded-full bg-forest px-6 py-4 font-semibold text-cream"
        >
          Book a consultation <Icon.Arrow className="size-4" />
        </a>
      </div>
    </header>
  )
}
