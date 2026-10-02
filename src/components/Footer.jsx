import { useLayoutEffect, useRef } from 'react'
import { gsap, MOTION_OK, scrollToTarget } from '../lib/motion'
import { Icon, Logo } from './Primitives'

const EXPLORE = [
  ['Treatments', '#treatments'],
  ['Your journey', '#journey'],
  ['Doctors', '#doctors'],
  ['Reviews', '#reviews'],
  ['Visit us', '#visit'],
]

export default function Footer() {
  const root = useRef(null)

  useLayoutEffect(() => {
    const mm = gsap.matchMedia(root)
    mm.add(MOTION_OK, () => {
      gsap.fromTo(
        '[data-wordmark] span',
        { yPercent: 60 },
        {
          yPercent: 0,
          stagger: 0.08,
          ease: 'none',
          scrollTrigger: { trigger: root.current, start: 'top bottom', end: 'bottom bottom', scrub: 1 },
        },
      )
      gsap.fromTo(
        '[data-footer-inner]',
        { yPercent: -10, autoAlpha: 0.6 },
        {
          yPercent: 0,
          autoAlpha: 1,
          ease: 'none',
          scrollTrigger: { trigger: root.current, start: 'top bottom', end: 'top 40%', scrub: 1 },
        },
      )
    })
    return () => mm.revert()
  }, [])

  const go = (e, href) => {
    e.preventDefault()
    scrollToTarget(href)
  }

  return (
    <footer ref={root} className="relative overflow-hidden bg-forest-deep text-cream">
      <div data-footer-inner className="mx-auto max-w-7xl px-4 pt-20 md:px-6 md:pt-28">
        <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr_1.2fr] lg:gap-10">
          <div className="sm:col-span-2 lg:col-span-1">
            <Logo className="text-cream" />
            <p className="mt-5 max-w-sm leading-relaxed text-cream/60">
              Holistic health and Ayurveda for chronic and autoimmune conditions. Root-cause care for body, mind and energy.
            </p>
            <a
              href="#book"
              onClick={(e) => go(e, '#book')}
              className="mt-8 inline-flex items-center gap-2 rounded-full bg-turmeric px-6 py-3.5 font-semibold text-forest-deep hover:bg-[#ecb560]"
            >
              Book a consultation <Icon.Arrow className="size-4" />
            </a>
          </div>

          <nav aria-label="Footer">
            <p className="eyebrow text-turmeric">Explore</p>
            <ul className="mt-4 space-y-2.5">
              {EXPLORE.map(([label, href]) => (
                <li key={href}>
                  <a href={href} onClick={(e) => go(e, href)} className="text-cream/75 hover:text-cream">
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <p className="eyebrow text-turmeric">Visit</p>
            <p className="mt-4 leading-relaxed text-cream/75">
              Sector 78, Sohana
              <br />
              Mohali, Punjab
            </p>
            <p className="mt-3 text-sm leading-relaxed text-cream/55">
              Mon – Sat
              <br />
              10:30 AM – 1:00 PM
              <br />
              4:00 PM – 7:00 PM
            </p>
          </div>

          <div>
            <p className="eyebrow text-turmeric">Contact</p>
            <ul className="mt-4 space-y-2.5 text-cream/75">
              <li>
                <a href="tel:+919988042121" className="hover:text-cream">
                  +91 99880 42121
                </a>
              </li>
              <li>
                <a href="https://wa.me/919988042121" target="_blank" rel="noreferrer" className="hover:text-cream">
                  WhatsApp
                </a>
              </li>
              <li>
                <a href="mailto:daiviksatva@gmail.com" className="break-words hover:text-cream">
                  daiviksatva@gmail.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-16 flex flex-col justify-between gap-3 border-t border-cream/10 pt-6 text-sm text-cream/45 sm:flex-row">
          <p>© 2026 Daiviksatva Holistic Health &amp; Ayurveda Clinic</p>
          <p>Sector 78, Mohali · Punjab</p>
        </div>
      </div>

      <p
        data-wordmark
        aria-hidden="true"
        className="mt-6 flex justify-center overflow-hidden whitespace-nowrap px-2 pb-[2.5vw] font-display text-[18.5vw] font-light leading-[0.85] tracking-[-0.04em]"
      >
        <span className="text-outline text-cream/50">Daivik</span>
        <span className="italic text-turmeric">satva</span>
      </p>
    </footer>
  )
}
