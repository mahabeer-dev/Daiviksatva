import { useLayoutEffect, useRef } from 'react'
import { gsap, ScrollTrigger, MOTION_OK, PHOTOS, img, revealHead, scrollToTarget } from '../lib/motion'
import { Icon, SplitText } from './Primitives'

const CHAKRAS = ['#b4613f', '#c77b2e', '#e2a54a', '#8fa382', '#6f93a6', '#5e6a9a', '#8a6f9e']

const DAY = [
  ['6:00', 'Wake, warm water'],
  ['6:30', 'Yoga & pranayama'],
  ['8:00', 'Light breakfast'],
  ['1:00', 'Main meal of the day'],
  ['7:30', 'Early, light dinner'],
  ['10:00', 'Sleep'],
]

function CardHead({ n, title, children, dark = false }) {
  return (
    <div>
      <p className={`eyebrow ${dark ? 'text-turmeric' : 'text-saffron'}`}>0{n}</p>
      <h3 className={`mt-3 font-display text-[1.9rem] leading-[1.05] tracking-tight ${dark ? 'text-cream' : 'text-forest'}`}>
        {title}
      </h3>
      <p className={`mt-3 max-w-sm text-[0.95rem] leading-relaxed ${dark ? 'text-cream/75' : 'text-muted'}`}>{children}</p>
    </div>
  )
}

const card =
  'group relative overflow-hidden rounded-[2rem] shadow-[0_30px_60px_-40px_rgb(23_58_46/0.35)] transition-[translate] duration-700 ease-[cubic-bezier(.22,1,.36,1)] hover:-translate-y-1.5'
const light = `${card} border border-forest/[0.08] bg-ivory p-7`

export default function Treatments() {
  const root = useRef(null)

  useLayoutEffect(() => {
    const mm = gsap.matchMedia(root)
    mm.add(MOTION_OK, () => {
      revealHead(root.current.querySelector('[data-head]'))

      gsap.set('[data-tcard]', { autoAlpha: 0, y: 70, filter: 'blur(10px)' })
      ScrollTrigger.batch('[data-tcard]', {
        start: 'top 88%',
        once: true,
        onEnter: (cards) =>
          gsap.to(cards, { autoAlpha: 1, y: 0, filter: 'blur(0px)', duration: 1.2, stagger: 0.1, ease: 'power4.out' }),
      })

      gsap.utils.toArray('[data-tparallax]').forEach((el) => {
        gsap.fromTo(
          el,
          { yPercent: -7 },
          {
            yPercent: 7,
            ease: 'none',
            scrollTrigger: { trigger: el.closest('[data-tcard]'), start: 'top bottom', end: 'bottom top', scrub: 1 },
          },
        )
      })

      // Chakra column: a slow wave of light rising up the spine.
      gsap.to('[data-chakra]', {
        scale: 1.45,
        boxShadow: '0 0 0 6px rgb(255 255 255 / 0.18)',
        duration: 0.7,
        ease: 'sine.inOut',
        stagger: { each: 0.22, from: 'end', repeat: -1, yoyo: true, repeatDelay: 1.1 },
      })

      // Breathing guide: 4 s in, 4 s out.
      gsap
        .timeline({ repeat: -1 })
        .set('[data-breath-in]', { autoAlpha: 1 })
        .set('[data-breath-out]', { autoAlpha: 0 })
        .fromTo('[data-breath]', { scale: 0.62 }, { scale: 1, duration: 4, ease: 'sine.inOut' })
        .set('[data-breath-in]', { autoAlpha: 0 })
        .set('[data-breath-out]', { autoAlpha: 1 })
        .to('[data-breath]', { scale: 0.62, duration: 4, ease: 'sine.inOut' })

      // Daily routine: the line fills as the card scrolls through.
      gsap.fromTo(
        '[data-day-line]',
        { scaleY: 0 },
        {
          scaleY: 1,
          ease: 'none',
          scrollTrigger: { trigger: '[data-day]', start: 'top 80%', end: 'bottom 45%', scrub: 0.8 },
        },
      )
      gsap.fromTo(
        '[data-day-row]',
        { autoAlpha: 0.25 },
        {
          autoAlpha: 1,
          stagger: 0.5,
          ease: 'none',
          scrollTrigger: { trigger: '[data-day]', start: 'top 80%', end: 'bottom 45%', scrub: 0.8 },
        },
      )
    })
    return () => mm.revert()
  }, [])

  return (
    <section id="treatments" ref={root} className="relative bg-cream py-24 md:py-36">
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        <div data-head className="grid gap-8 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-7">
            <p data-fade className="eyebrow text-saffron">Treatments</p>
            <h2 className="mt-5 font-display text-5xl font-light leading-[1] tracking-[-0.03em] text-forest md:text-7xl">
              <SplitText parts={['Feeling unwell,', '\n', 'but your reports', '\n', 'say', { text: 'normal?', className: 'italic text-saffron' }]} />
            </h2>
          </div>
          <div className="lg:col-span-5 lg:justify-self-end">
            <p data-fade className="max-w-md text-lg leading-relaxed text-muted">
              Your struggles are real. We look past the symptoms to the root, in body, mind and energy, with six ways of
              healing that work together.
            </p>
            <a
              data-fade
              href="#book"
              onClick={(e) => {
                e.preventDefault()
                scrollToTarget('#book')
              }}
              className="mt-6 inline-flex items-center gap-2 font-semibold text-forest underline decoration-saffron/50 underline-offset-[6px] hover:text-saffron"
            >
              Book a consultation <Icon.Arrow className="size-4" />
            </a>
          </div>
        </div>

        <div className="mt-16 grid gap-4 md:grid-cols-2 lg:grid-cols-12 lg:gap-5">
          {/* 01 Ayurvedic treatments */}
          <article data-tcard className={`${card} min-h-[34rem] bg-forest-deep md:col-span-2 lg:col-span-7 lg:row-span-2`}>
            <div className="absolute inset-0 overflow-hidden">
              <img
                data-tparallax
                src={img(PHOTOS.apothecary, 1200)}
                alt="Glass jars and copper vessels of dried herbs in an Ayurvedic dispensary"
                loading="lazy"
                className="h-[115%] w-full object-cover transition-[scale] duration-[1.6s] ease-[cubic-bezier(.22,1,.36,1)] group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-forest-deep via-forest-deep/55 to-forest-deep/10" />
            </div>
            <div className="relative flex h-full flex-col justify-between p-7 md:p-10">
              <div className="flex flex-wrap gap-2">
                {['Root-cause care', 'Dosha-based', 'Doctor-guided'].map((c) => (
                  <span key={c} className="rounded-full border border-cream/20 bg-cream/10 px-3 py-1 text-xs font-semibold text-cream backdrop-blur-md">
                    {c}
                  </span>
                ))}
              </div>
              <div className="mt-40">
                <CardHead n={1} title="Ayurvedic treatments" dark>
                  Traditional therapies chosen for your body type, to restore balance, ease symptoms and support lasting
                  well-being.
                </CardHead>
              </div>
            </div>
          </article>

          {/* 02 Diet */}
          <article data-tcard className={`${light} lg:col-span-5`}>
            <CardHead n={2} title="Personalised diet coaching">
              Food plans built around your dosha and your family&apos;s kitchen.
            </CardHead>
            <ul className="mt-6 space-y-2">
              {[
                ['Breakfast', 'Stewed apple, cardamom', PHOTOS.goldenMilk],
                ['Lunch', 'Moong dal, rice, ghee', PHOTOS.thali],
                ['Dinner', 'Light vegetable khichdi', PHOTOS.spices],
              ].map(([meal, dish, photo]) => (
                <li key={meal} className="flex items-center gap-3 rounded-2xl border border-forest/[0.07] bg-white/60 p-2 pr-4">
                  <img src={img(photo, 120, 120)} alt="" loading="lazy" className="size-11 rounded-xl object-cover" />
                  <div className="flex-1">
                    <p className="text-[0.7rem] font-semibold uppercase tracking-wider text-saffron">{meal}</p>
                    <p className="text-sm font-semibold text-forest">{dish}</p>
                  </div>
                  <span className="rounded-full bg-sage/20 px-2 py-0.5 text-[0.7rem] font-semibold text-forest">Pitta-calm</span>
                </li>
              ))}
            </ul>
          </article>

          {/* 03 Yoga & chakra */}
          <article data-tcard className={`${light} grid grid-cols-[1fr_7rem] gap-5 sm:grid-cols-[1fr_9.5rem] lg:col-span-5`}>
            <div className="flex flex-col justify-between">
              <CardHead n={3} title="Yoga & chakra healing">
                Guided practice to bring mind, body and energy back into rhythm.
              </CardHead>
              <p className="mt-6 flex items-center gap-2 text-sm font-semibold text-forest">
                <Icon.Clock className="size-4 text-saffron" /> 15 min a day, at your pace
              </p>
            </div>
            <div className="relative -my-7 -mr-7 overflow-hidden">
              <img
                src={img(PHOTOS.yogaSunrise, 400, 640)}
                alt="Woman meditating cross-legged at sunrise"
                loading="lazy"
                className="h-full w-full object-cover transition-[scale] duration-[1.6s] group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-l from-transparent to-ivory/10" />
              <ul className="absolute bottom-[22%] left-1/2 top-[30%] flex -translate-x-1/2 flex-col-reverse justify-between" aria-hidden="true">
                {CHAKRAS.map((c) => (
                  <li key={c} data-chakra className="size-2.5 rounded-full" style={{ background: c }} />
                ))}
              </ul>
            </div>
          </article>

          {/* 04 Medicines */}
          <article data-tcard className={`${light} md:col-span-1 lg:col-span-4`}>
            <CardHead n={4} title="Ayurvedic medicines">
              Natural formulations prescribed for your condition, with gentle reminders.
            </CardHead>
            <div className="mt-6 space-y-2">
              <div className="flex items-center gap-3 rounded-2xl bg-forest p-3 text-cream">
                <img src={img(PHOTOS.mortar, 100, 100)} alt="" loading="lazy" className="size-10 rounded-xl object-cover" />
                <div className="flex-1">
                  <p className="text-sm font-semibold">Herbal churna</p>
                  <p className="text-xs text-cream/60">After lunch</p>
                </div>
                <span className="flex items-center gap-1 rounded-full bg-turmeric px-2.5 py-1 text-xs font-bold text-forest-deep">
                  <Icon.Check className="size-3" /> Taken
                </span>
              </div>
              <div className="flex items-center gap-3 rounded-2xl border border-forest/10 bg-white/60 p-3">
                <span className="grid size-10 place-items-center rounded-xl bg-sand text-saffron">
                  <Icon.Clock className="size-5" />
                </span>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-forest">Evening dose</p>
                  <p className="text-xs text-muted">Reminder at 9:30 PM</p>
                </div>
                <span className="relative h-5 w-9 rounded-full bg-sage">
                  <span className="absolute right-0.5 top-0.5 size-4 rounded-full bg-white shadow" />
                </span>
              </div>
            </div>
          </article>

          {/* 05 Stress */}
          <article data-tcard className={`${light} flex flex-col md:col-span-1 lg:col-span-4`}>
            <CardHead n={5} title="Stress management">
              Breathing, meditation and rest techniques that calm the mind.
            </CardHead>
            <div className="relative mt-6 grid flex-1 place-items-center py-4" aria-hidden="true">
              <span className="absolute size-40 rounded-full border border-dashed border-forest/15" />
              <span data-breath style={{ transform: 'scale(0.8)' }}
                className="absolute size-40 rounded-full bg-gradient-to-br from-sage/50 to-turmeric/40 blur-[1px]" />
              <span className="absolute size-24 rounded-full bg-ivory/75 backdrop-blur" />
              <span className="relative grid text-center text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-forest">
                <span data-breath-in className="[grid-area:1/1]">Breathe in</span>
                <span data-breath-out className="invisible [grid-area:1/1]">Breathe out</span>
              </span>
            </div>
          </article>

          {/* 06 Lifestyle */}
          <article data-tcard className={`${light} md:col-span-2 lg:col-span-4`}>
            <CardHead n={6} title="Lifestyle transformation">
              A daily routine (dinacharya) that keeps you well long after treatment.
            </CardHead>
            <ol data-day className="relative mt-6 space-y-2.5 pl-6">
              <span className="absolute bottom-1.5 left-[5px] top-1.5 w-px bg-forest/10" />
              <span data-day-line className="absolute bottom-1.5 left-[5px] top-1.5 w-px origin-top bg-saffron" />
              {DAY.map(([t, label]) => (
                <li key={t} data-day-row className="relative flex items-baseline gap-3 text-sm">
                  <span className="absolute -left-6 top-1.5 size-[11px] rounded-full border-2 border-ivory bg-saffron" />
                  <span className="w-11 font-semibold tabular-nums text-saffron">{t}</span>
                  <span className="text-forest">{label}</span>
                </li>
              ))}
            </ol>
          </article>
        </div>
      </div>
    </section>
  )
}
