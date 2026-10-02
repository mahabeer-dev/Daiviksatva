import { useLayoutEffect, useRef, useState } from 'react'
import { gsap, prefersReducedMotion } from '../lib/motion'
import { LotusMark } from './Primitives'

export default function Preloader({ onDone }) {
  const root = useRef(null)
  const [gone, setGone] = useState(prefersReducedMotion)

  useLayoutEffect(() => {
    if (prefersReducedMotion()) {
      onDone()
      return
    }
    if (!root.current) return

    const ctx = gsap.context(() => {
      const counter = { v: 0 }
      const num = root.current.querySelector('[data-count]')

      gsap.set('[data-draw]', { strokeDasharray: 1, strokeDashoffset: 1 })

      gsap
        .timeline({
          defaults: { ease: 'power3.out' },
          onComplete: () => {
            setGone(true)
            onDone()
          },
        })
        .to('[data-draw]', { strokeDashoffset: 0, duration: 1.3, stagger: 0.12, ease: 'power2.inOut' })
        .from('[data-letter]', { yPercent: 110, duration: 0.9, stagger: 0.035, ease: 'power4.out' }, 0.35)
        .from('[data-tagline]', { autoAlpha: 0, y: 10, duration: 0.7 }, 0.9)
        .fromTo('[data-bar]', { scaleX: 0 }, { scaleX: 1, duration: 1.6, ease: 'power2.inOut' }, 0.1)
        .to(counter, {
          v: 100,
          duration: 1.6,
          ease: 'power2.inOut',
          onUpdate: () => (num.textContent = String(Math.round(counter.v)).padStart(3, '0')),
        }, 0.1)
        .to('[data-preloader-inner]', { yPercent: -40, autoAlpha: 0, duration: 0.8, ease: 'power3.in' }, '+=0.15')
        .to(root.current, { yPercent: -100, duration: 1, ease: 'power4.inOut' }, '-=0.45')
    }, root)

    return () => ctx.revert()
  }, [onDone])

  if (gone) return null

  const word = 'Daiviksatva'
  return (
    <div
      ref={root}
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-forest-deep text-cream"
      aria-hidden="true"
    >
      <div data-preloader-inner className="flex flex-col items-center">
        <LotusMark stroke className="size-20 text-turmeric" />
        <div className="mt-6 flex overflow-hidden font-display text-5xl leading-[1.1] tracking-tight md:text-6xl">
          {word.split('').map((ch, i) => (
            <span key={i} data-letter className={`inline-block ${i >= 6 ? 'italic text-turmeric' : ''}`}>
              {ch}
            </span>
          ))}
        </div>
        <p data-tagline className="eyebrow mt-4 text-cream/60">
          Holistic Health &amp; Ayurveda
        </p>
      </div>

      <div className="absolute inset-x-6 bottom-10 flex items-end justify-between gap-6 md:inset-x-12">
        <div className="relative h-px flex-1 bg-cream/15">
          <div data-bar className="absolute inset-0 origin-left bg-turmeric" />
        </div>
        <span data-count className="font-display text-sm tabular-nums text-cream/70">
          000
        </span>
      </div>
    </div>
  )
}
