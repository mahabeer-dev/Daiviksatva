import { useLayoutEffect, useRef, useState } from 'react'
import { gsap, ScrollTrigger, MOTION_OK, prefersReducedMotion } from '../lib/motion'
import { LotusMark, SplitText } from './Primitives'
import { Phone, SCREENS, playScreen, primeScreen } from './PhoneScreens'

const STEPS = [
  {
    kicker: 'Book',
    title: 'Book your consultation',
    body: 'Choose a morning or evening session that suits your day. Confirmation and reminders arrive on WhatsApp.',
    chips: ['Morning 10:30 – 1:00', 'Evening 4:00 – 7:00', 'WhatsApp reminders'],
  },
  {
    kicker: 'Understand',
    title: 'Understand your body',
    body: 'Your doctor reads your pulse, goes through your history and maps your Prakriti, so treatment begins at the root cause, not the symptom.',
    chips: ['Nadi Pariksha', 'Prakriti analysis', 'Full history'],
  },
  {
    kicker: 'Heal',
    title: 'Follow a plan made for you',
    body: 'Ayurvedic medicines, a diet built around your dosha and daily yoga and chakra practice, in one simple plan for each day.',
    chips: ['Ayurvedic medicines', 'Dosha-based diet', 'Yoga & chakra healing'],
  },
  {
    kicker: 'Grow',
    title: 'Track progress, stay on course',
    body: 'Log how you feel each day. Your doctor reviews it before every follow-up and adjusts the plan as you heal.',
    chips: ['Daily check-ins', 'Doctor follow-ups', 'Plan adjustments'],
  },
]

const DESKTOP = '(min-width: 1024px)'

export default function Journey() {
  const root = useRef(null)
  const phone = useRef(null)
  const prev = useRef(0)
  const [active, setActive] = useState(0)

  // Scroll wiring
  useLayoutEffect(() => {
    const mm = gsap.matchMedia(root)

    // Desktop: each step drives the pinned phone (with or without motion).
    mm.add(DESKTOP, () => {
      gsap.utils.toArray('[data-step]').forEach((step, i) => {
        ScrollTrigger.create({
          trigger: step,
          start: 'top 55%',
          end: 'bottom 55%',
          onToggle: (self) => self.isActive && setActive(i),
        })
      })
    })

    mm.add(MOTION_OK, () => {
      gsap.fromTo(
        '[data-word]',
        { yPercent: 115 },
        {
          yPercent: 0,
          duration: 1.1,
          stagger: 0.06,
          ease: 'power4.out',
          scrollTrigger: { trigger: '[data-journey-head]', start: 'top 78%', once: true },
        },
      )
      gsap.fromTo(
        '[data-head-fade]',
        { autoAlpha: 0, y: 30 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 1,
          stagger: 0.1,
          ease: 'power4.out',
          scrollTrigger: { trigger: '[data-journey-head]', start: 'top 72%', once: true },
        },
      )

      gsap.utils.toArray('[data-step]').forEach((step) => {
        gsap.fromTo(
          step.querySelectorAll('[data-reveal]'),
          { autoAlpha: 0, y: 36, filter: 'blur(8px)' },
          {
            autoAlpha: 1,
            y: 0,
            filter: 'blur(0px)',
            duration: 1,
            stagger: 0.08,
            ease: 'power4.out',
            scrollTrigger: { trigger: step, start: 'top 75%', once: true },
          },
        )
      })
    })

    // Mobile / tablet: the phone under each step plays its own screen.
    mm.add(`(max-width: 1023px) and ${MOTION_OK}`, () => {
      gsap.utils.toArray('[data-inline-screen]').forEach((screen) => {
        primeScreen(screen)
        ScrollTrigger.create({ trigger: screen, start: 'top 70%', once: true, onEnter: () => playScreen(screen) })
      })
    })

    mm.add(`${DESKTOP} and ${MOTION_OK}`, () => {
      // First screen plays when the phone arrives; later ones play on step change.
      const first = phone.current.querySelector('[data-screen]')
      primeScreen(first)
      ScrollTrigger.create({ trigger: '[data-steps]', start: 'top 60%', once: true, onEnter: () => playScreen(first) })

      gsap.fromTo(
        '[data-phone-wrap]',
        { y: 120, rotate: -4, scale: 0.92 },
        {
          y: 0,
          rotate: 0,
          scale: 1,
          ease: 'none',
          scrollTrigger: { trigger: '[data-steps]', start: 'top bottom', end: 'top 30%', scrub: 1 },
        },
      )
      gsap.fromTo(
        '[data-progress]',
        { scaleY: 0 },
        {
          scaleY: 1,
          ease: 'none',
          scrollTrigger: { trigger: '[data-steps]', start: 'top 55%', end: 'bottom 55%', scrub: 0.6 },
        },
      )
      gsap.to('[data-mandala]', {
        rotate: 120,
        ease: 'none',
        scrollTrigger: { trigger: root.current, start: 'top bottom', end: 'bottom top', scrub: 1.2 },
      })
    })

    return () => mm.revert()
  }, [])

  // Swap the pinned phone's screen when the active step changes.
  useLayoutEffect(() => {
    if (prev.current === active) return
    const screens = gsap.utils.toArray('[data-screen]', phone.current)
    const reduce = prefersReducedMotion()
    const dir = active >= prev.current ? 1 : -1

    screens.forEach((s, i) => {
      if (i === active) {
        if (reduce) return gsap.set(s, { autoAlpha: 1 })
        gsap.fromTo(
          s,
          { autoAlpha: 0, yPercent: 7 * dir, scale: 0.97, filter: 'blur(8px)' },
          { autoAlpha: 1, yPercent: 0, scale: 1, filter: 'blur(0px)', duration: 0.75, ease: 'power3.out', overwrite: true },
        )
        playScreen(s)
      } else if (reduce) {
        gsap.set(s, { autoAlpha: 0 })
      } else {
        gsap.to(s, {
          autoAlpha: 0,
          yPercent: -5 * dir,
          scale: 0.97,
          filter: 'blur(8px)',
          duration: 0.4,
          ease: 'power2.in',
          overwrite: true,
        })
      }
    })
    prev.current = active
  }, [active])

  return (
    <section id="journey" ref={root} className="relative isolate overflow-clip bg-forest-deep text-cream">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-0 h-px w-[80%] -translate-x-1/2 bg-gradient-to-r from-transparent via-turmeric/40 to-transparent" />
        <div className="absolute -left-40 top-1/3 size-[40rem] rounded-full bg-forest blur-[120px]" />
      </div>

      {/* Heading */}
      <div data-journey-head className="mx-auto grid max-w-7xl gap-8 px-4 pt-24 md:px-6 md:pt-36 lg:grid-cols-12 lg:items-end">
        <div className="lg:col-span-7">
          <p data-head-fade className="eyebrow text-turmeric">Your healing journey</p>
          <h2 className="mt-5 font-display text-5xl font-light leading-[1] tracking-[-0.03em] md:text-7xl">
            <SplitText parts={["Your doctor's plan.", '\n', { text: 'Your pace.', className: 'italic text-turmeric' }]} />
          </h2>
        </div>
        <p data-head-fade className="max-w-md text-lg leading-relaxed text-cream/65 lg:col-span-5 lg:justify-self-end">
          From the first consultation to every follow-up, your care stays in one place, and in your pocket.
        </p>
      </div>

      <div className="mx-auto max-w-7xl px-4 pb-24 md:px-6 md:pb-36 lg:grid lg:grid-cols-2 lg:gap-0">
        {/* Pinned phone (desktop) */}
        <div className="hidden lg:block">
          <div className="sticky top-0 flex h-svh flex-col items-center justify-center pt-20">
            <div aria-hidden="true" className="pointer-events-none absolute inset-0 grid place-items-center">
              <div className="size-[30rem] rounded-full bg-turmeric/20 blur-[110px]" />
              <LotusMark className="absolute size-[38rem] text-cream/[0.04]" />
              <svg data-mandala viewBox="0 0 200 200" className="absolute size-[34rem] text-cream/[0.07]">
                <circle cx="100" cy="100" r="98" fill="none" stroke="currentColor" strokeWidth="0.4" strokeDasharray="1 3" />
                <circle cx="100" cy="100" r="80" fill="none" stroke="currentColor" strokeWidth="0.4" />
                {Array.from({ length: 24 }).map((_, i) => (
                  <ellipse
                    key={i}
                    cx="100"
                    cy="38"
                    rx="7"
                    ry="20"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="0.4"
                    transform={`rotate(${i * 15} 100 100)`}
                  />
                ))}
              </svg>
            </div>

            <div data-phone-wrap className="relative">
              {/* Shrinks the phone on shorter laptop screens; GSAP animates the outer wrapper */}
              <div className="[@media(max-height:860px)]:-my-9 [@media(max-height:860px)]:scale-[0.88] [@media(max-height:740px)]:-my-[62px] [@media(max-height:740px)]:scale-[0.8]">
                <Phone innerRef={phone}>
                  {SCREENS.map((Screen, i) => (
                    <div
                      key={i}
                      data-screen
                      className="absolute inset-0"
                      style={{ visibility: i === 0 ? 'visible' : 'hidden', opacity: i === 0 ? 1 : 0 }}
                      aria-hidden={i !== active}
                    >
                      <Screen />
                    </div>
                  ))}
                </Phone>
              </div>
            </div>

            <div className="relative mt-8 flex items-center gap-4 text-sm">
              <span className="font-display tabular-nums text-cream/80">
                <span className="text-turmeric">0{active + 1}</span> / 04
              </span>
              <span className="flex gap-1.5">
                {STEPS.map((s, i) => (
                  <span
                    key={s.kicker}
                    className={`h-1 rounded-full transition-all duration-700 ${i === active ? 'w-8 bg-turmeric' : 'w-3 bg-cream/20'}`}
                  />
                ))}
              </span>
              <span className="eyebrow text-cream/50">{STEPS[active].kicker}</span>
            </div>
          </div>
        </div>

        {/* Steps */}
        <ol data-steps className="relative lg:border-l lg:border-cream/10 lg:pl-20">
          <span
            data-progress
            aria-hidden="true"
            className="absolute -left-px top-0 hidden h-full w-px origin-top bg-gradient-to-b from-turmeric via-turmeric to-turmeric/0 lg:block"
          />
          {STEPS.map((step, i) => {
            const Screen = SCREENS[i]
            const isActive = i === active
            return (
              <li
                key={step.kicker}
                data-step
                className={`relative pt-20 transition-opacity duration-700 lg:flex lg:min-h-svh lg:flex-col lg:justify-center lg:pt-0 ${
                  isActive ? 'lg:opacity-100' : 'lg:opacity-30'
                }`}
              >
                <span
                  aria-hidden="true"
                  className={`absolute -left-20 top-1/2 hidden size-3 -translate-x-1/2 -translate-y-1/2 rounded-full border transition-all duration-700 lg:block ${
                    isActive
                      ? 'border-turmeric bg-turmeric shadow-[0_0_0_6px_rgb(226_165_74/0.15)]'
                      : 'border-cream/30 bg-forest-deep'
                  }`}
                />
                <div data-reveal className="flex items-center gap-4">
                  <span className="font-display text-6xl font-light italic text-turmeric/90 md:text-7xl">0{i + 1}</span>
                  <span className="h-px w-10 bg-cream/20" />
                  <span className="eyebrow text-cream/55">{step.kicker}</span>
                </div>
                <h3 data-reveal className="mt-6 max-w-md font-display text-4xl leading-[1.05] tracking-tight md:text-5xl">
                  {step.title}
                </h3>
                <p data-reveal className="mt-5 max-w-md text-[1.05rem] leading-relaxed text-cream/65">
                  {step.body}
                </p>
                <ul data-reveal className="mt-7 flex max-w-md flex-wrap gap-2">
                  {step.chips.map((c) => (
                    <li key={c} className="rounded-full border border-cream/15 bg-cream/[0.04] px-3.5 py-1.5 text-sm text-cream/80">
                      {c}
                    </li>
                  ))}
                </ul>

                {/* Mobile / tablet: the phone sits under its step */}
                <div data-reveal className="mt-12 flex justify-center lg:hidden">
                  <div className="relative">
                    <div aria-hidden="true" className="absolute inset-0 -z-10 scale-110 rounded-full bg-turmeric/20 blur-[80px]" />
                    <Phone className="max-[360px]:scale-[0.88]">
                      <div data-inline-screen className="absolute inset-0">
                        <Screen />
                      </div>
                    </Phone>
                  </div>
                </div>
              </li>
            )
          })}
        </ol>
      </div>
    </section>
  )
}
