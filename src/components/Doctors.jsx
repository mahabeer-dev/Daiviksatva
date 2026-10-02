import { useLayoutEffect, useRef } from 'react'
import { gsap, MOTION_OK, revealHead } from '../lib/motion'
import { Icon, LotusMark, SplitText } from './Primitives'

// Names and titles from the clinic's current website. Roles, bios and portraits to be confirmed with the clinic.
const TEAM = [
  {
    name: 'Acharya Pawan Ji',
    initials: 'PJ',
    role: 'CEO',
    focus: 'Holistic healing',
    bio: 'Leads the clinic’s mind, body and energy approach, bringing Ayurveda, yoga and daily lifestyle practice together in every plan.',
    tags: ['Holistic healing', 'Yoga', 'Lifestyle'],
    tone: 'from-forest to-forest-deep',
    accent: 'text-turmeric',
    depth: -40,
  },
  {
    name: 'Dr. Kriti Singh',
    initials: 'KS',
    role: 'Co-Founder',
    focus: 'Ayurveda',
    bio: 'Sees patients for consultation, pulse reading and Prakriti assessment, and shapes each personal treatment plan.',
    tags: ['Consultation', 'Nadi Pariksha', 'Treatment plans'],
    tone: 'from-saffron to-clay',
    accent: 'text-cream',
    depth: -110,
  },
  {
    name: 'Dr. Anurag Minhas',
    initials: 'AM',
    role: 'Patient care & outreach',
    focus: 'Holistic health',
    bio: 'Helps patients and their families understand their care, and keeps the clinic connected with the community.',
    tags: ['Patient support', 'Wellness talks', 'Community'],
    tone: 'from-sage to-forest',
    accent: 'text-ivory',
    depth: -60,
  },
]

const STATS = [
  { value: 30, suffix: '+', label: 'Years of experience' },
  { value: 270, suffix: '+', label: 'Yoga & chakra sessions' },
  { value: 5, suffix: '.0', label: 'Rating on Google', star: true },
  { value: 6, suffix: '', label: 'Days a week, two sessions' },
]

function Portrait({ person }) {
  return (
    <div className="relative aspect-[4/5] overflow-hidden rounded-t-[999px] rounded-b-[2rem] shadow-[0_40px_80px_-40px_rgb(23_58_46/0.55)]">
      <div data-arch className={`absolute inset-0 bg-gradient-to-b ${person.tone}`}>
        <div className="absolute inset-0 transition-[scale] duration-[1.4s] ease-[cubic-bezier(.22,1,.36,1)] group-hover:scale-110">
          <svg viewBox="0 0 200 250" className="absolute inset-0 h-full w-full text-white/[0.09]" aria-hidden="true">
            {Array.from({ length: 9 }).map((_, i) => (
              <circle key={i} cx="100" cy="250" r={40 + i * 26} fill="none" stroke="currentColor" strokeWidth="0.8" />
            ))}
          </svg>
          <LotusMark className="absolute left-1/2 top-[18%] size-24 -translate-x-1/2 text-white/15" />
        </div>
        <div className="absolute inset-x-0 bottom-0 flex flex-col items-center pb-[18%]">
          <span className={`font-display text-[5.5rem] font-light italic leading-none ${person.accent}`}>{person.initials}</span>
          <span className="eyebrow mt-3 text-white/60">{person.focus}</span>
        </div>
      </div>

      {/* Bio panel slides up on hover (desktop) */}
      <div className="absolute inset-x-3 bottom-3 hidden translate-y-[calc(100%+1rem)] rounded-[1.4rem] bg-ivory/95 p-5 text-forest shadow-xl backdrop-blur transition-transform duration-700 ease-[cubic-bezier(.22,1,.36,1)] group-hover:translate-y-0 lg:block">
        <p className="text-sm leading-relaxed text-muted">{person.bio}</p>
        <ul className="mt-3 flex flex-wrap gap-1.5">
          {person.tags.map((t) => (
            <li key={t} className="rounded-full bg-sand px-2.5 py-1 text-xs font-semibold text-forest">
              {t}
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export default function Doctors() {
  const root = useRef(null)

  useLayoutEffect(() => {
    const mm = gsap.matchMedia(root)
    mm.add(MOTION_OK, () => {
      revealHead(root.current.querySelector('[data-head]'))

      gsap.utils.toArray('[data-person]').forEach((person, i) => {
        const tl = gsap.timeline({ scrollTrigger: { trigger: person, start: 'top 85%', once: true }, delay: i * 0.12 })
        tl.fromTo(person, { autoAlpha: 0, y: 80 }, { autoAlpha: 1, y: 0, duration: 1.2, ease: 'power4.out' })
          .fromTo(
            person.querySelector('[data-arch]'),
            { clipPath: 'inset(100% 0% 0% 0%)' },
            { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.4, ease: 'expo.inOut' },
            0,
          )
          .fromTo(person.querySelectorAll('[data-pfade]'), { autoAlpha: 0, y: 16 }, { autoAlpha: 1, y: 0, stagger: 0.08, duration: 0.8 }, 0.6)
      })

      // Counters
      gsap.utils.toArray('[data-count-to]').forEach((el) => {
        const target = Number(el.dataset.countTo)
        const obj = { v: 0 }
        gsap.to(obj, {
          v: target,
          duration: 2,
          ease: 'power3.out',
          scrollTrigger: { trigger: el, start: 'top 88%', once: true },
          onUpdate: () => (el.textContent = Math.round(obj.v)),
        })
      })
      gsap.fromTo(
        '[data-stat]',
        { autoAlpha: 0, y: 30 },
        {
          autoAlpha: 1,
          y: 0,
          stagger: 0.1,
          duration: 1,
          ease: 'power4.out',
          scrollTrigger: { trigger: '[data-stats]', start: 'top 88%', once: true },
        },
      )
    })

    mm.add(`(min-width: 1024px) and ${MOTION_OK}`, () => {
      gsap.utils.toArray('[data-pdepth]').forEach((el) => {
        gsap.to(el, {
          y: Number(el.dataset.pdepth),
          ease: 'none',
          scrollTrigger: { trigger: root.current, start: 'top bottom', end: 'bottom top', scrub: 1 },
        })
      })
    })

    return () => mm.revert()
  }, [])

  return (
    <section id="doctors" ref={root} className="relative overflow-hidden bg-cream py-24 md:py-36">
      <div aria-hidden="true" className="pointer-events-none absolute -right-40 top-40 size-[36rem] rounded-full bg-turmeric/15 blur-[120px]" />
      <div className="relative mx-auto max-w-7xl px-4 md:px-6">
        <div data-head className="grid gap-8 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-7">
            <p data-fade className="eyebrow text-saffron">Our doctors</p>
            <h2 className="mt-5 font-display text-5xl font-light leading-[1] tracking-[-0.03em] text-forest md:text-7xl">
              <SplitText parts={['Care from people', '\n', 'who', { text: 'listen.', className: 'italic text-saffron' }]} />
            </h2>
          </div>
          <p data-fade className="max-w-md text-lg leading-relaxed text-muted lg:col-span-5 lg:justify-self-end">
            Every plan at Daiviksatva is shaped in person, by a team that brings classical Ayurveda, yoga and lifestyle
            practice together.
          </p>
        </div>

        <ul className="mt-16 grid gap-12 sm:grid-cols-2 lg:mt-20 lg:grid-cols-3 lg:gap-8">
          {TEAM.map((p, i) => (
            <li key={p.name} data-pdepth={p.depth} className={i === 1 ? 'lg:mt-24' : ''}>
              <article data-person className="group">
                <Portrait person={p} />
                <div className="mt-6 flex items-start justify-between gap-4">
                  <div>
                    <p data-pfade className="eyebrow text-saffron">{p.role}</p>
                    <h3 data-pfade className="mt-2 font-display text-3xl tracking-tight text-forest">
                      {p.name}
                    </h3>
                  </div>
                  <span
                    data-pfade
                    className="mt-1 grid size-11 shrink-0 place-items-center rounded-full border border-forest/15 text-forest transition-colors duration-500 group-hover:border-forest group-hover:bg-forest group-hover:text-turmeric"
                  >
                    <Icon.Arrow className="size-4 -rotate-45" />
                  </span>
                </div>
                <p data-pfade className="mt-3 text-[0.95rem] leading-relaxed text-muted lg:hidden">
                  {p.bio}
                </p>
              </article>
            </li>
          ))}
        </ul>

        <dl data-stats className="mt-24 grid grid-cols-2 gap-x-6 gap-y-10 border-t border-forest/10 pt-12 lg:grid-cols-4">
          {STATS.map((s) => (
            <div key={s.label} data-stat>
              <dt className="sr-only">{s.label}</dt>
              <dd className="flex items-baseline font-display text-6xl font-light tracking-tight text-forest md:text-7xl">
                <span data-count-to={s.value}>{s.value}</span>
                <span className="text-saffron">{s.suffix}</span>
                {s.star && <Icon.Star className="ml-2 size-7 self-center text-turmeric" />}
              </dd>
              <p aria-hidden="true" className="mt-2 text-sm text-muted">
                {s.label}
              </p>
            </div>
          ))}
        </dl>
      </div>
    </section>
  )
}
