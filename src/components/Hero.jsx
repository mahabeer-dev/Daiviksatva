import { useLayoutEffect, useRef } from 'react'
import { gsap, ScrollTrigger, MOTION_OK, PHOTOS, img, scrollToTarget } from '../lib/motion'
import { Icon, LotusMark, SplitText } from './Primitives'

const SERVICES = [
  'Ayurvedic Treatments',
  'Personalised Diet',
  'Yoga & Chakra Healing',
  'Ayurvedic Medicines',
  'Stress Management',
  'Lifestyle Transformation',
]
const PRINCIPLES = ['Root-cause care', 'Doctor-guided', 'Personal plans', 'Mind · Body · Energy', 'Natural healing']

export default function Hero({ ready }) {
  const root = useRef(null)

  useLayoutEffect(() => {
    const mm = gsap.matchMedia(root)

    mm.add(MOTION_OK, () => {
      const hidden = () => {
        gsap.set('[data-word]', { yPercent: 115 })
        gsap.set('[data-fade]', { autoAlpha: 0, y: 28 })
        gsap.set('[data-frame]', { clipPath: 'inset(100% 0% 0% 0% round 2.25rem)' })
        gsap.set('[data-card]', { autoAlpha: 0, y: 40, scale: 0.94 })
      }

      if (!ready) {
        hidden()
        return
      }

      // Entrance, played once the preloader lifts.
      gsap
        .timeline({ defaults: { ease: 'power4.out' } })
        .fromTo('[data-word]', { yPercent: 115 }, { yPercent: 0, duration: 1.2, stagger: 0.07 }, 0.15)
        .fromTo('[data-fade]', { autoAlpha: 0, y: 28 }, { autoAlpha: 1, y: 0, duration: 1, stagger: 0.09 }, 0.55)
        .fromTo(
          '[data-frame]',
          { clipPath: 'inset(100% 0% 0% 0% round 2.25rem)' },
          { clipPath: 'inset(0% 0% 0% 0% round 2.25rem)', duration: 1.5, stagger: 0.15, ease: 'expo.inOut' },
          0,
        )
        .fromTo('[data-frame-img]', { scale: 1.35 }, { scale: 1.12, duration: 2, ease: 'expo.out' }, 0.2)
        .fromTo(
          '[data-card]',
          { autoAlpha: 0, y: 40, scale: 0.94 },
          { autoAlpha: 1, y: 0, scale: 1, duration: 1.1, stagger: 0.12, ease: 'power3.out' },
          0.95,
        )

      // Idle float on the cards (inner layer, so it never fights the scroll parallax).
      gsap.utils.toArray('[data-float]').forEach((el, i) => {
        gsap.to(el, { y: i % 2 ? 9 : -9, duration: 3 + i * 0.6, ease: 'sine.inOut', yoyo: true, repeat: -1 })
      })

      gsap.to('[data-spin]', { rotate: 360, duration: 24, ease: 'none', repeat: -1 })

      // Scroll depth: text drifts up, photos and cards move at different speeds.
      const scrub = { trigger: root.current, start: 'top top', end: 'bottom top', scrub: 1 }
      gsap.to('[data-hero-copy]', { y: -90, autoAlpha: 0.2, ease: 'none', scrollTrigger: scrub })
      gsap.to('[data-frame-img]', { yPercent: 10, ease: 'none', scrollTrigger: scrub })
      gsap.utils.toArray('[data-depth]').forEach((el) => {
        gsap.to(el, { y: Number(el.dataset.depth), ease: 'none', scrollTrigger: scrub })
      })

      // Marquee rows that speed up and follow the scroll direction.
      const rows = gsap.utils.toArray('[data-marquee]').map((row) => {
        const dir = Number(row.dataset.marquee)
        return gsap.fromTo(
          row,
          { xPercent: dir > 0 ? -50 : 0 },
          { xPercent: dir > 0 ? 0 : -50, duration: Number(row.dataset.speed), ease: 'none', repeat: -1 },
        )
      })
      const speed = { v: 1 }
      const apply = () => rows.forEach((t) => t.timeScale(speed.v))
      ScrollTrigger.create({
        trigger: '[data-marquee-wrap]',
        start: 'top bottom',
        end: 'bottom top',
        onUpdate: (self) => {
          const boost = 1 + Math.min(Math.abs(self.getVelocity()) / 300, 5)
          if (boost <= speed.v) return
          gsap.killTweensOf(speed)
          speed.v = boost
          apply()
          gsap.to(speed, { v: 1, duration: 1.4, ease: 'power3.out', onUpdate: apply })
        },
      })
    })

    return () => mm.revert()
  }, [ready])

  return (
    <section id="top" ref={root} className="relative isolate overflow-hidden pt-28 md:pt-32">
      {/* Background washes */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -left-40 top-24 size-[38rem] rounded-full bg-sage/25 blur-[120px]" />
        <div className="absolute -right-24 top-1/3 size-[30rem] rounded-full bg-turmeric/25 blur-[120px]" />
        <LotusMark className="absolute -right-40 -top-24 size-[44rem] text-forest/[0.035]" />
      </div>

      <div className="mx-auto grid max-w-7xl items-center gap-14 px-4 pb-16 md:px-6 lg:min-h-[calc(100svh-8rem)] lg:grid-cols-12 lg:gap-8 lg:pb-20">
        {/* Copy */}
        <div data-hero-copy className="lg:col-span-6">
          <p data-fade className="inline-flex items-center gap-2 rounded-full border border-forest/15 bg-ivory/60 px-3.5 py-1.5 text-saffron">
            <Icon.Leaf className="size-4" />
            <span className="eyebrow text-[0.65rem]">Holistic Health &amp; Ayurveda · Mohali</span>
          </p>

          <h1 className="mt-7 font-display text-[3.4rem] font-light leading-[0.98] tracking-[-0.03em] text-forest sm:text-7xl xl:text-[6.4rem]">
            <SplitText
              parts={['Heal from', '\n', 'the root,', '\n', { text: 'naturally.', className: 'italic text-saffron' }]}
            />
          </h1>

          <p data-fade className="mt-7 max-w-md text-lg leading-relaxed text-muted">
            Ayurveda, personalised diet and yoga for chronic and autoimmune conditions, guided by doctors who
            listen beyond your reports.
          </p>

          <div data-fade className="mt-9 flex flex-wrap items-center gap-3">
            <a
              href="#book"
              onClick={(e) => {
                e.preventDefault()
                scrollToTarget('#book')
              }}
              className="group inline-flex items-center gap-3 rounded-full bg-forest py-2 pl-6 pr-2 font-semibold text-cream shadow-[0_18px_40px_-16px_rgb(23_58_46/0.7)] transition-colors hover:bg-forest-deep"
            >
              Book a consultation
              <span className="grid size-10 place-items-center rounded-full bg-turmeric text-forest-deep transition-transform duration-500 group-hover:rotate-[-45deg]">
                <Icon.Arrow className="size-4" />
              </span>
            </a>
            <a
              href="#journey"
              onClick={(e) => {
                e.preventDefault()
                scrollToTarget('#journey')
              }}
              className="inline-flex items-center gap-2 rounded-full px-5 py-4 font-semibold text-forest transition-colors hover:text-saffron"
            >
              See how it works
            </a>
          </div>

          <dl data-fade className="mt-12 grid max-w-md grid-cols-2 gap-6 border-t border-forest/10 pt-6 text-sm">
            <div>
              <dt className="flex items-center gap-1.5 text-muted">
                <Icon.Clock className="size-4" /> Mon – Sat
              </dt>
              <dd className="mt-1 font-semibold text-forest">
                10:30 AM – 1:00 PM
                <br />
                4:00 PM – 7:00 PM
              </dd>
            </div>
            <div>
              <dt className="flex items-center gap-1.5 text-muted">
                <Icon.Phone className="size-4" /> Call the clinic
              </dt>
              <dd className="mt-1 font-semibold text-forest">
                <a href="tel:+919988042121" className="hover:text-saffron">
                  +91 99880 42121
                </a>
              </dd>
            </div>
          </dl>
        </div>

        {/* Image composition */}
        <div className="relative h-[30rem] sm:h-[36rem] lg:col-span-6 lg:h-[40rem]">
          <div data-depth="-40" className="absolute right-0 top-0 h-[88%] w-[80%] lg:w-[76%]">
            <div data-frame className="h-full w-full overflow-hidden rounded-[2.25rem] bg-sand">
              <img
                data-frame-img
                src={img(PHOTOS.shirodhara, 1100)}
                alt="Shirodhara: warm herbal oil poured over the forehead during an Ayurvedic treatment"
                className="h-full w-full object-cover object-[30%_50%]"
                fetchPriority="high"
              />
            </div>
          </div>

          <div data-depth="-120" className="absolute bottom-0 left-0 h-[42%] w-[44%] lg:w-[40%]">
            <div
              data-frame
              className="h-full w-full overflow-hidden rounded-[2.25rem] border-[6px] border-cream bg-sand shadow-2xl shadow-forest/20"
            >
              <img
                data-frame-img
                src={img(PHOTOS.goldenMilk, 600)}
                alt="Golden turmeric milk with fresh ginger"
                className="h-full w-full object-cover"
              />
            </div>
          </div>

          {/* Rating */}
          <div data-depth="-160" className="absolute left-[2%] top-[12%] sm:left-[6%]">
            <div data-card>
              <div data-float className="glass rounded-2xl px-4 py-3">
                <div className="flex items-center gap-0.5 text-turmeric">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Icon.Star key={i} className="size-4" />
                  ))}
                  <span className="ml-1.5 font-display text-lg leading-none text-forest">5.0</span>
                </div>
                <p className="mt-1 text-xs text-muted">11 reviews on Google</p>
              </div>
            </div>
          </div>

          {/* Next available slot */}
          <div data-depth="-70" className="absolute bottom-[4%] right-[2%] sm:bottom-[8%] sm:right-[-2%]">
            <div data-card>
              <div data-float className="glass flex items-center gap-4 rounded-2xl p-3 pr-3.5">
                <div className="grid size-11 place-items-center rounded-xl bg-forest text-turmeric">
                  <Icon.Clock className="size-5" />
                </div>
                <div>
                  <p className="flex items-center gap-1.5 text-[0.7rem] font-semibold uppercase tracking-wider text-muted">
                    <span className="relative flex size-2">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-sage opacity-75" />
                      <span className="relative inline-flex size-2 rounded-full bg-sage" />
                    </span>
                    Next available
                  </p>
                  <p className="font-display text-lg leading-tight text-forest">Today · 5:30 PM</p>
                </div>
                <span className="ml-1 rounded-full bg-turmeric px-3 py-1.5 text-xs font-bold text-forest-deep">Book</span>
              </div>
            </div>
          </div>

          {/* Rotating badge */}
          <div data-depth="-200" className="absolute -top-4 right-[-2%] hidden sm:block lg:right-[-4%]">
            <div data-card>
              <div data-float className="relative grid size-36 place-items-center">
                <svg data-spin viewBox="0 0 100 100" className="absolute inset-0 text-forest" aria-hidden="true">
                  <defs>
                    <path id="ring" d="M50 50m-41 0a41 41 0 1 1 82 0a41 41 0 1 1-82 0" />
                  </defs>
                  <text className="fill-current text-[8px] font-semibold uppercase tracking-[0.2em]">
                    <textPath href="#ring">Ayurveda · Yoga · Diet · Healing ·</textPath>
                  </text>
                </svg>
                <div className="size-[5.5rem] overflow-hidden rounded-full border-4 border-cream shadow-xl shadow-forest/25">
                  <img src={img(PHOTOS.herbsHand, 240, 240)} alt="" className="h-full w-full object-cover" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Services marquee */}
      <div
        data-marquee-wrap
        className="relative overflow-hidden border-y border-forest/10 bg-ivory/50 py-5"
        aria-label="Our treatments"
      >
        <div className="flex w-max" data-marquee="-1" data-speed="38">
          {[0, 1].map((copy) => (
            <ul key={copy} className="flex shrink-0 items-center" aria-hidden={copy === 1}>
              {SERVICES.map((s, i) => (
                <li key={s} className="flex items-center">
                  <span
                    className={`whitespace-nowrap px-8 font-display text-5xl font-light tracking-tight md:text-7xl ${
                      i % 2 ? 'text-outline text-forest/70 italic' : 'text-forest'
                    }`}
                  >
                    {s}
                  </span>
                  <LotusMark className="size-8 shrink-0 text-turmeric md:size-10" />
                </li>
              ))}
            </ul>
          ))}
        </div>
        <div className="mt-4 flex w-max border-t border-forest/10 pt-4" data-marquee="1" data-speed="30" aria-hidden="true">
          {[0, 1].map((copy) => (
            <ul key={copy} className="flex shrink-0 items-center">
              {[...PRINCIPLES, ...PRINCIPLES].map((p, i) => (
                <li key={i} className="flex items-center gap-8 px-4">
                  <span className="eyebrow whitespace-nowrap text-forest/70">{p}</span>
                  <span className="size-1.5 rounded-full bg-saffron" />
                </li>
              ))}
            </ul>
          ))}
        </div>
      </div>
    </section>
  )
}
