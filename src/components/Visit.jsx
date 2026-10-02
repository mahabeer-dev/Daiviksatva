import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { gsap, MOTION_OK, revealHead } from '../lib/motion'
import { DAY_NAMES, SESSIONS, clinicStatus, isOpenDay, istNow, sessionText, upcomingDays } from '../lib/hours'
import { Icon, SplitText } from './Primitives'

const PHONE = '919988042121'
const MAP_SRC =
  'https://maps.google.com/maps?q=Daiviksatva%20Holistic%20Health%20and%20Ayurveda%20Clinic%2C%20Sector%2078%2C%20Mohali&z=15&output=embed'

// Answers paraphrase the FAQ on the clinic's current website.
const FAQ = [
  {
    q: 'How can Ayurveda help with chronic symptoms?',
    a: 'Ayurveda looks for the root cause and works on it with natural remedies, diet and daily habits, aiming to ease symptoms and build lasting well-being.',
  },
  {
    q: 'Is my treatment personalised?',
    a: 'Yes. Your plan is built around your body type, history and concerns, and adjusted at every follow-up.',
  },
  {
    q: 'Do you support autoimmune conditions?',
    a: 'Yes. Our approach combines Ayurvedic therapies, diet plans and yoga to help you manage symptoms naturally.',
  },
  {
    q: 'What makes Daiviksatva different?',
    a: 'We bring classical Ayurveda, personal attention and modern wellness practice together, so your care covers body, mind and energy.',
  },
  {
    q: 'What should I bring to my first visit?',
    a: 'Any recent test reports, a list of the medicines you take, and the questions you want answered.',
  },
]

function useClinicStatus() {
  const [status, setStatus] = useState(() => clinicStatus())
  useEffect(() => {
    const id = setInterval(() => setStatus(clinicStatus()), 60_000)
    return () => clearInterval(id)
  }, [])
  return status
}

function StatusPill({ status, dark = false }) {
  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-sm font-semibold ${
        dark ? 'bg-cream/10 text-cream' : 'border border-forest/10 bg-ivory text-forest'
      }`}
    >
      <span className="relative flex size-2">
        {status.open && <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-sage opacity-75" />}
        <span className={`relative inline-flex size-2 rounded-full ${status.open ? 'bg-sage' : 'bg-clay'}`} />
      </span>
      {status.text}
    </span>
  )
}

function BookingForm() {
  const days = useMemo(() => upcomingDays(6), [])
  const [dayKey, setDayKey] = useState(days[0].key)
  const day = days.find((d) => d.key === dayKey)
  const available = SESSIONS.filter((s) => !day.isToday || day.minutesNow < s.to)
  const [sessionId, setSessionId] = useState(available.at(-1).id)
  const session = available.find((s) => s.id === sessionId) ?? available[0]
  const [name, setName] = useState('')
  const [error, setError] = useState('')
  const [sent, setSent] = useState(false)

  const submit = (e) => {
    e.preventDefault()
    if (!name.trim()) {
      setError('Please add your name so the clinic knows who to expect.')
      return
    }
    const text = `Hello Daiviksatva, I'd like to book a consultation.\nName: ${name.trim()}\nPreferred: ${day.label}, ${session.label.toLowerCase()} session (${sessionText(session)})`
    window.open(`https://wa.me/${PHONE}?text=${encodeURIComponent(text)}`, '_blank', 'noopener')
    setSent(true)
  }

  return (
    <form onSubmit={submit} noValidate className="space-y-6">
      <div>
        <label htmlFor="book-name" className="eyebrow text-cream/60">
          Your name
        </label>
        <input
          id="book-name"
          value={name}
          onChange={(e) => {
            setName(e.target.value)
            setError('')
          }}
          autoComplete="name"
          placeholder="Full name"
          aria-invalid={!!error}
          aria-describedby={error ? 'book-error' : undefined}
          className="mt-2 w-full rounded-2xl border border-cream/15 bg-cream/[0.06] px-5 py-4 text-lg text-cream placeholder:text-cream/35 focus:border-turmeric focus:outline-none"
        />
        {error && (
          <p id="book-error" className="mt-2 text-sm text-turmeric">
            {error}
          </p>
        )}
      </div>

      <fieldset>
        <legend className="eyebrow text-cream/60">Preferred day</legend>
        <div className="mt-2 grid grid-cols-6 gap-1.5 sm:gap-2">
          {days.map((d) => (
            <label
              key={d.key}
              className={`flex cursor-pointer flex-col items-center rounded-2xl border py-2.5 text-xs transition-colors has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-turmeric ${
                d.key === dayKey ? 'border-turmeric bg-turmeric text-forest-deep' : 'border-cream/15 text-cream/70 hover:border-cream/40'
              }`}
            >
              <input
                type="radio"
                name="day"
                value={d.key}
                checked={d.key === dayKey}
                onChange={() => {
                  setDayKey(d.key)
                  setSent(false)
                }}
                className="sr-only"
              />
              {d.isToday ? 'Today' : d.short}
              <span className="mt-0.5 font-display text-xl">{d.num}</span>
            </label>
          ))}
        </div>
      </fieldset>

      <fieldset>
        <legend className="eyebrow text-cream/60">Session</legend>
        <div className="mt-2 grid grid-cols-2 gap-2">
          {SESSIONS.map((s) => {
            const disabled = !available.includes(s)
            const checked = session.id === s.id
            return (
              <label
                key={s.id}
                className={`rounded-2xl border px-4 py-3 transition-colors has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-turmeric ${
                  disabled
                    ? 'cursor-not-allowed border-cream/5 text-cream/30 line-through'
                    : checked
                      ? 'cursor-pointer border-cream bg-cream text-forest-deep'
                      : 'cursor-pointer border-cream/15 text-cream/80 hover:border-cream/40'
                }`}
              >
                <input
                  type="radio"
                  name="session"
                  value={s.id}
                  checked={checked}
                  disabled={disabled}
                  onChange={() => setSessionId(s.id)}
                  className="sr-only"
                />
                <span className="block text-sm font-bold">{s.label}</span>
                <span className="block text-xs opacity-70">{sessionText(s)}</span>
              </label>
            )
          })}
        </div>
      </fieldset>

      <button
        type="submit"
        className="group flex w-full items-center justify-between gap-3 rounded-full bg-turmeric py-2 pl-6 pr-2 text-left text-[0.95rem] font-semibold text-forest-deep sm:text-base transition-colors hover:bg-[#ecb560]"
      >
        {sent ? 'Opened in WhatsApp. Send it to confirm' : `Request ${day.label}, ${session.label.toLowerCase()}`}
        <span className="grid size-11 place-items-center rounded-full bg-forest-deep text-turmeric transition-transform duration-500 group-hover:-rotate-45">
          <Icon.Arrow className="size-4" />
        </span>
      </button>
      <p className="flex items-center gap-2 text-xs text-cream/50">
        <Icon.Chat className="size-4 text-sage" /> Opens WhatsApp with your request. The clinic confirms your slot.
      </p>
    </form>
  )
}

export default function Visit() {
  const root = useRef(null)
  const status = useClinicStatus()
  const today = istNow().day
  const [open, setOpen] = useState(0)

  useLayoutEffect(() => {
    const mm = gsap.matchMedia(root)
    mm.add(MOTION_OK, () => {
      revealHead(root.current.querySelector('[data-head]'))
      revealHead(root.current.querySelector('[data-faq-head]'))

      gsap.utils.toArray('[data-vcard]').forEach((el) => {
        gsap.fromTo(
          el,
          { autoAlpha: 0, y: 60 },
          {
            autoAlpha: 1,
            y: 0,
            duration: 1.2,
            ease: 'power4.out',
            scrollTrigger: { trigger: el, start: 'top 88%', once: true },
          },
        )
      })
      gsap.fromTo(
        '[data-map]',
        { clipPath: 'inset(0% 0% 100% 0% round 2rem)' },
        {
          clipPath: 'inset(0% 0% 0% 0% round 2rem)',
          duration: 1.6,
          ease: 'expo.inOut',
          scrollTrigger: { trigger: '[data-map]', start: 'top 85%', once: true },
        },
      )
      gsap.fromTo(
        '[data-hours-row]',
        { autoAlpha: 0, x: -16 },
        {
          autoAlpha: 1,
          x: 0,
          stagger: 0.06,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: { trigger: '[data-hours]', start: 'top 85%', once: true },
        },
      )
      gsap.fromTo(
        '[data-faq-item]',
        { autoAlpha: 0, y: 24 },
        {
          autoAlpha: 1,
          y: 0,
          stagger: 0.08,
          duration: 0.9,
          ease: 'power4.out',
          scrollTrigger: { trigger: '[data-faq]', start: 'top 85%', once: true },
        },
      )
    })
    return () => mm.revert()
  }, [])

  return (
    <section id="visit" ref={root} className="relative bg-cream py-24 md:py-36">
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        <div data-head className="grid gap-8 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-7">
            <p data-fade className="eyebrow text-saffron">Visit us</p>
            <h2 className="mt-5 font-display text-5xl font-light leading-[1] tracking-[-0.03em] text-forest md:text-7xl">
              <SplitText parts={['Come in.', { text: 'Slow down.', className: 'italic text-saffron' }]} />
            </h2>
          </div>
          <div className="lg:col-span-5 lg:justify-self-end">
            <p data-fade>
              <StatusPill status={status} />
            </p>
            <p data-fade className="mt-5 max-w-md text-lg leading-relaxed text-muted">
              A quiet clinic in Sector 78, Mohali. Morning and evening sessions, six days a week.
            </p>
          </div>
        </div>

        <div className="mt-16 grid gap-5 lg:grid-cols-12">
          {/* Hours & address */}
          <div data-vcard className="rounded-[2rem] border border-forest/[0.08] bg-ivory p-7 md:p-9 lg:col-span-5">
            <h3 className="eyebrow text-saffron">Visiting hours</h3>
            <table data-hours className="mt-4 w-full text-sm">
              <caption className="sr-only">Clinic hours, India time</caption>
              <thead className="sr-only">
                <tr>
                  <th scope="col">Day</th>
                  <th scope="col">Morning</th>
                  <th scope="col">Evening</th>
                </tr>
              </thead>
              <tbody>
                {[1, 2, 3, 4, 5, 6, 0].map((d) => (
                  <tr
                    key={d}
                    data-hours-row
                    className={`border-b border-forest/[0.06] last:border-0 ${d === today ? 'font-semibold text-forest' : 'text-muted'}`}
                  >
                    <th scope="row" className="py-2.5 text-left font-[inherit]">
                      <span className="flex items-center gap-2">
                        {DAY_NAMES[d]}
                        {d === today && <span className="rounded-full bg-turmeric/25 px-2 py-0.5 text-[0.65rem] font-bold uppercase tracking-wider text-saffron">Today</span>}
                      </span>
                    </th>
                    {isOpenDay(d) ? (
                      SESSIONS.map((s) => (
                        <td key={s.id} className="py-2.5 text-right tabular-nums">
                          {sessionText(s)}
                        </td>
                      ))
                    ) : (
                      <td colSpan={2} className="py-2.5 text-right">
                        Closed
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="mt-8 border-t border-forest/10 pt-7">
              <h3 className="eyebrow text-saffron">Address</h3>
              <p className="mt-3 text-lg leading-snug text-forest">
                Deep Nagar Colony, Sector 78, Sohana
                <br />
                S.A.S. Nagar (Mohali), Punjab
              </p>
              <div className="mt-6 flex flex-wrap gap-2">
                <a
                  href="https://g.co/kgs/VCXjz8R"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-full bg-forest px-5 py-3 text-sm font-semibold text-cream hover:bg-forest-deep"
                >
                  <Icon.Pin className="size-4 text-turmeric" /> Directions
                </a>
                <a
                  href="tel:+919988042121"
                  className="inline-flex items-center gap-2 rounded-full border border-forest/15 px-5 py-3 text-sm font-semibold text-forest hover:border-forest"
                >
                  <Icon.Phone className="size-4" /> Call
                </a>
                <a
                  href={`https://wa.me/${PHONE}`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-full border border-forest/15 px-5 py-3 text-sm font-semibold text-forest hover:border-forest"
                >
                  <Icon.Chat className="size-4" /> WhatsApp
                </a>
              </div>
            </div>
          </div>

          {/* Map */}
          <div data-vcard className="relative min-h-[26rem] lg:col-span-7">
            <div data-map className="absolute inset-0 overflow-hidden rounded-[2rem] bg-sand">
              <iframe
                title="Map: Daiviksatva Holistic Health and Ayurveda Clinic, Sector 78, Mohali"
                src={MAP_SRC}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="h-full w-full border-0 [filter:sepia(.25)_saturate(.8)_contrast(.95)]"
              />
            </div>
            <div className="glass pointer-events-none absolute bottom-4 left-4 right-4 flex items-center gap-4 rounded-2xl p-4 sm:right-auto">
              <span className="grid size-11 place-items-center rounded-xl bg-forest text-turmeric">
                <Icon.Pin className="size-5" />
              </span>
              <span>
                <span className="block font-display text-lg leading-tight text-forest">Daiviksatva Clinic</span>
                <span className="flex items-center gap-1 text-xs text-muted">
                  <Icon.Star className="size-3.5 text-turmeric" /> 5.0 · Sector 78, Mohali
                </span>
              </span>
            </div>
          </div>

          {/* Booking */}
          <div
            id="book"
            data-vcard
            className="relative grid scroll-mt-24 gap-10 overflow-hidden rounded-[2rem] bg-forest-deep p-7 text-cream md:p-12 lg:col-span-12 lg:grid-cols-12"
          >
            <div aria-hidden="true" className="pointer-events-none absolute -left-24 -top-24 size-96 rounded-full bg-turmeric/15 blur-[100px]" />
            <div className="relative lg:col-span-5">
              <p className="eyebrow text-turmeric">Book a consultation</p>
              <h3 className="mt-4 font-display text-4xl font-light leading-[1.05] tracking-tight md:text-5xl">
                Pick a day. <span className="italic text-turmeric">We’ll do the rest.</span>
              </h3>
              <p className="mt-5 max-w-sm leading-relaxed text-cream/65">
                Choose a day and session, and send your request on WhatsApp. The clinic replies to confirm your time.
              </p>
              <div className="mt-8">
                <StatusPill status={status} dark />
              </div>
            </div>
            <div className="relative lg:col-span-6 lg:col-start-7">
              <BookingForm />
            </div>
          </div>
        </div>

        {/* FAQ */}
        <div className="mt-24 grid gap-10 md:mt-32 lg:grid-cols-12">
          <div data-faq-head className="lg:col-span-4">
            <p data-fade className="eyebrow text-saffron">FAQ</p>
            <h2 className="mt-5 font-display text-4xl font-light leading-[1.05] tracking-[-0.02em] text-forest md:text-5xl">
              <SplitText parts={['Before', 'your', { text: 'visit.', className: 'italic text-saffron' }]} />
            </h2>
            <p data-fade className="mt-5 text-muted">
              Something else on your mind?{' '}
              <a href="tel:+919988042121" className="font-semibold text-forest underline decoration-saffron/50 underline-offset-4">
                Call the clinic
              </a>
              .
            </p>
          </div>
          <ul data-faq className="lg:col-span-7 lg:col-start-6">
            {FAQ.map((item, i) => {
              const isOpen = open === i
              return (
                <li key={item.q} data-faq-item className="border-b border-forest/10">
                  <h3>
                    <button
                      type="button"
                      onClick={() => setOpen(isOpen ? -1 : i)}
                      aria-expanded={isOpen}
                      aria-controls={`faq-${i}`}
                      className="flex w-full items-center gap-5 py-6 text-left"
                    >
                      <span className="font-display text-sm text-saffron">0{i + 1}</span>
                      <span className="flex-1 font-display text-xl text-forest md:text-2xl">{item.q}</span>
                      <span
                        className={`grid size-9 shrink-0 place-items-center rounded-full border transition-all duration-500 ${
                          isOpen ? 'rotate-45 border-forest bg-forest text-turmeric' : 'border-forest/15 text-forest'
                        }`}
                      >
                        <svg viewBox="0 0 20 20" className="size-4" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
                          <path d="M10 4v12M4 10h12" strokeLinecap="round" />
                        </svg>
                      </span>
                    </button>
                  </h3>
                  <div
                    id={`faq-${i}`}
                    className={`grid transition-[grid-template-rows] duration-500 ease-[cubic-bezier(.22,1,.36,1)] ${
                      isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
                    }`}
                  >
                    <div className="overflow-hidden">
                      <p className="max-w-xl pb-6 pl-10 leading-relaxed text-muted">{item.a}</p>
                    </div>
                  </div>
                </li>
              )
            })}
          </ul>
        </div>
      </div>
    </section>
  )
}
