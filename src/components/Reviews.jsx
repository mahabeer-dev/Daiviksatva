import { useLayoutEffect, useRef } from 'react'
import { gsap, MOTION_OK, revealHead } from '../lib/motion'
import { Icon, SplitText } from './Primitives'

// Placeholder copy for the preview only. Replace with the clinic's real Google reviews (with permission) before launch.
const REVIEWS = [
  {
    topic: 'First consultation',
    quote: 'The doctor spent real time understanding my history before suggesting anything. I left with a plan I actually understood.',
    who: 'R. S.',
    where: 'Mohali',
  },
  {
    topic: 'Diet plan',
    quote: 'The diet chart was simple to follow at home, and built around food my family already cooks.',
    who: 'A. K.',
    where: 'Chandigarh',
  },
  {
    topic: 'Yoga & breathing',
    quote: 'The evening yoga and breathing sessions became the calmest part of my day.',
    who: 'M. B.',
    where: 'Kharar',
  },
  {
    topic: 'Clinic & care',
    quote: 'Warm, unhurried, and always reachable on WhatsApp between follow-ups.',
    who: 'S. P.',
    where: 'Zirakpur',
  },
]

export default function Reviews() {
  const root = useRef(null)

  useLayoutEffect(() => {
    const mm = gsap.matchMedia(root)
    mm.add(MOTION_OK, () => {
      revealHead(root.current.querySelector('[data-head]'))

      gsap.fromTo(
        '[data-rating]',
        { autoAlpha: 0, scale: 0.9, y: 30 },
        {
          autoAlpha: 1,
          scale: 1,
          y: 0,
          duration: 1.2,
          ease: 'power4.out',
          scrollTrigger: { trigger: '[data-rating]', start: 'top 85%', once: true },
        },
      )
      gsap.fromTo(
        '[data-rating] [data-star]',
        { scale: 0, rotate: -90 },
        {
          scale: 1,
          rotate: 0,
          stagger: 0.08,
          duration: 0.8,
          ease: 'back.out(2)',
          scrollTrigger: { trigger: '[data-rating]', start: 'top 85%', once: true },
        },
      )

      // Sticky stack: each card recedes as the next one slides over it.
      const cards = gsap.utils.toArray('[data-review]')
      cards.forEach((card, i) => {
        gsap.fromTo(
          card.querySelectorAll('[data-qword]'),
          { yPercent: 110 },
          {
            yPercent: 0,
            stagger: 0.025,
            duration: 0.9,
            ease: 'power4.out',
            scrollTrigger: { trigger: card, start: 'top 75%', once: true },
          },
        )
        const next = cards[i + 1]
        if (!next) return
        // Explicit start value: tweening filter from 'none' would start at brightness(0) and flash black.
        gsap.fromTo(card, { scale: 1, filter: 'brightness(1)' }, {
          scale: 0.9 + i * 0.02,
          filter: 'brightness(0.72)',
          ease: 'none',
          scrollTrigger: { trigger: next, start: 'top 85%', end: 'top 20%', scrub: true, invalidateOnRefresh: true },
        })
      })
    })
    return () => mm.revert()
  }, [])

  return (
    <section id="reviews" ref={root} className="relative bg-forest-deep py-24 text-cream md:py-36">
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-turmeric/40 to-transparent" />
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        <div data-head className="grid gap-10 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-7">
            <p data-fade className="eyebrow text-turmeric">Patient reviews</p>
            <h2 className="mt-5 font-display text-5xl font-light leading-[1] tracking-[-0.03em] md:text-7xl">
              <SplitText parts={['Kind words from', '\n', { text: 'our patients.', className: 'italic text-turmeric' }]} />
            </h2>
          </div>

          <div data-rating className="rounded-[2rem] border border-cream/10 bg-cream/[0.04] p-7 lg:col-span-5 lg:justify-self-end">
            <div className="flex items-end gap-5">
              <span className="font-display text-7xl font-light leading-none">5.0</span>
              <div className="pb-1.5">
                <div className="flex gap-1 text-turmeric">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Icon.Star key={i} data-star className="size-5" />
                  ))}
                </div>
                <p className="mt-1.5 text-sm text-cream/65">11 reviews on Google</p>
              </div>
            </div>
            <a
              href="https://g.co/kgs/VCXjz8R"
              target="_blank"
              rel="noreferrer"
              className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-turmeric hover:text-cream"
            >
              Read them on Google <Icon.Arrow className="size-4 -rotate-45" />
            </a>
          </div>
        </div>
        <p data-fade className="mt-6 max-w-xl text-xs text-cream/45">
          Sample reviews for this preview. Your patients’ real Google reviews will appear here, with their permission.
        </p>

        <ol className="relative mt-16 md:mt-20">
          {REVIEWS.map((r, i) => (
            <li
              key={r.who}
              data-review
              className="sticky mb-8 origin-top md:mb-12"
              style={{ top: `calc(12vh + ${i * 1.5}rem)` }}
            >
              <figure className="relative overflow-hidden rounded-[2rem] border border-cream/10 bg-gradient-to-br from-[#1e4636] to-forest p-7 shadow-[0_-30px_60px_-30px_rgb(0_0_0/0.5)] md:min-h-[26rem] md:p-12">
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute -right-4 -top-16 font-display text-[18rem] italic leading-none text-cream/[0.05]"
                >
                  “
                </span>
                <div className="flex items-center justify-between">
                  <span className="rounded-full border border-cream/15 bg-cream/5 px-3 py-1 text-xs font-semibold text-cream/80">
                    {r.topic}
                  </span>
                  <span className="font-display text-sm tabular-nums text-cream/50">
                    0{i + 1} / 0{REVIEWS.length}
                  </span>
                </div>
                <blockquote className="relative mt-10 max-w-4xl font-display text-[1.9rem] font-light leading-[1.2] tracking-tight md:text-5xl">
                  <span className="sr-only">{r.quote}</span>
                  <span aria-hidden="true">
                    {r.quote.split(' ').map((w, j) => (
                      <span key={j}>
                        <span className="split-mask">
                          <span data-qword className="split-word">
                            {w}
                          </span>
                        </span>{' '}
                      </span>
                    ))}
                  </span>
                </blockquote>
                <figcaption className="mt-10 flex items-center justify-between gap-4 md:mt-14">
                  <span className="flex items-center gap-3">
                    <span className="grid size-11 place-items-center rounded-full bg-turmeric font-display text-sm text-forest-deep">
                      {r.who.replace(/[\s.]/g, '')}
                    </span>
                    <span>
                      <span className="block font-semibold">{r.who}</span>
                      <span className="block text-sm text-cream/55">Patient · {r.where}</span>
                    </span>
                  </span>
                  <span className="flex gap-0.5 text-turmeric" aria-label="5 out of 5 stars">
                    {Array.from({ length: 5 }).map((_, k) => (
                      <Icon.Star key={k} className="size-4" />
                    ))}
                  </span>
                </figcaption>
              </figure>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
