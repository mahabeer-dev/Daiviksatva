import { gsap, PHOTOS, img } from '../lib/motion'
import { Icon, LotusMark } from './Primitives'

/* ---------- Phone frame ---------- */

export function Phone({ children, innerRef, className = '' }) {
  return (
    <div
      className={`relative h-[620px] w-[300px] shrink-0 rounded-[3.1rem] bg-[#0c1411] p-[10px] shadow-[0_60px_120px_-40px_rgb(0_0_0/0.75),inset_0_0_0_1.5px_rgb(255_255_255/0.09)] ${className}`}
    >
      <span className="absolute -left-[3px] top-28 h-14 w-[3px] rounded-l bg-[#0c1411]" />
      <span className="absolute -right-[3px] top-36 h-20 w-[3px] rounded-r bg-[#0c1411]" />
      <div ref={innerRef} className="relative h-full w-full overflow-hidden rounded-[2.45rem] bg-ivory text-ink">
        <div className="absolute inset-x-0 top-0 z-20 flex h-11 items-center justify-between px-7 text-[12px] font-semibold">
          <span>5:30</span>
          <span className="absolute left-1/2 top-2.5 h-[26px] w-[90px] -translate-x-1/2 rounded-full bg-black" />
          <span className="flex items-center gap-1">
            <svg viewBox="0 0 18 12" className="h-2.5 w-4" fill="currentColor" aria-hidden="true">
              <rect x="0" y="8" width="3" height="4" rx="1" />
              <rect x="5" y="5.5" width="3" height="6.5" rx="1" />
              <rect x="10" y="3" width="3" height="9" rx="1" />
              <rect x="15" y="0" width="3" height="12" rx="1" />
            </svg>
            <span className="relative ml-0.5 h-[11px] w-[22px] rounded-[3px] border border-current/40 p-px">
              <span className="block h-full w-[75%] rounded-[1.5px] bg-current" />
            </span>
          </span>
        </div>
        {children}
        <span className="absolute bottom-2 left-1/2 z-20 h-1 w-28 -translate-x-1/2 rounded-full bg-ink/80" />
      </div>
    </div>
  )
}

/* Hides the in-screen details so playScreen can bring them in. */
export function primeScreen(screen) {
  gsap.set(screen.querySelectorAll('[data-ui]'), { y: 14, autoAlpha: 0 })
  gsap.set(screen.querySelectorAll('[data-bar]'), { scaleY: 0, transformOrigin: 'bottom' })
  gsap.set(screen.querySelectorAll('[data-hbar]'), { scaleX: 0, transformOrigin: 'left' })
  gsap.set(screen.querySelectorAll('[data-arc]'), { attr: { 'stroke-dasharray': '0 100' } })
  gsap.set(screen.querySelectorAll('[data-pulse]'), { strokeDasharray: 1, strokeDashoffset: 1 })
}

/* Plays the in-screen details: list items, bars, rings and the pulse line. */
export function playScreen(screen) {
  gsap.fromTo(
    screen.querySelectorAll('[data-ui]'),
    { y: 14, autoAlpha: 0 },
    { y: 0, autoAlpha: 1, duration: 0.6, stagger: 0.045, delay: 0.1, ease: 'power3.out', overwrite: true },
  )
  gsap.fromTo(
    screen.querySelectorAll('[data-bar]'),
    { scaleY: 0 },
    { scaleY: 1, transformOrigin: 'bottom', duration: 0.9, stagger: 0.06, delay: 0.35, ease: 'power3.out' },
  )
  gsap.fromTo(
    screen.querySelectorAll('[data-hbar]'),
    { scaleX: 0 },
    { scaleX: 1, transformOrigin: 'left', duration: 1, stagger: 0.1, delay: 0.35, ease: 'power3.out' },
  )
  screen.querySelectorAll('[data-arc]').forEach((arc, i) => {
    gsap.fromTo(
      arc,
      { attr: { 'stroke-dasharray': '0 100' } },
      { attr: { 'stroke-dasharray': `${arc.dataset.arc} ${100 - arc.dataset.arc}` }, duration: 1.1, delay: 0.3 + i * 0.15, ease: 'power3.inOut' },
    )
  })
  gsap.fromTo(
    screen.querySelectorAll('[data-pulse]'),
    { strokeDasharray: 1, strokeDashoffset: 1 },
    { strokeDashoffset: 0, duration: 1.6, delay: 0.4, ease: 'power2.inOut' },
  )
}

/* ---------- Shared bits ---------- */

function TopBar({ title, sub, right }) {
  return (
    <div data-ui className="flex items-center gap-3 px-4 pt-12">
      <span className="grid size-8 place-items-center rounded-full bg-sand/70 text-forest">
        <Icon.Back className="size-4" />
      </span>
      <div className="min-w-0 flex-1">
        <p className="truncate text-[15px] font-bold leading-tight text-forest">{title}</p>
        {sub && <p className="truncate text-[10.5px] text-muted">{sub}</p>}
      </div>
      {right}
    </div>
  )
}

const Avatar = ({ children, className = '' }) => (
  <span className={`grid size-9 shrink-0 place-items-center rounded-full font-display text-[13px] ${className}`}>
    {children}
  </span>
)

/* ---------- 01 Booking ---------- */

export function BookingScreen() {
  const days = [
    ['Mon', 5],
    ['Tue', 6],
    ['Wed', 7],
    ['Thu', 8],
    ['Fri', 9],
    ['Sat', 10],
  ]
  const slots = [
    ['4:00', ''],
    ['4:30', ''],
    ['5:00', 'taken'],
    ['5:30', 'picked'],
    ['6:00', ''],
    ['6:30', ''],
  ]
  return (
    <div className="flex h-full flex-col pb-7">
      <TopBar title="Book a visit" sub="Daiviksatva Clinic · Sector 78" right={<Avatar className="bg-turmeric/30 text-saffron">R</Avatar>} />

      <div data-ui className="mx-4 mt-4 flex items-center gap-3 rounded-2xl bg-forest p-3 text-cream">
        <Avatar className="size-11 bg-cream/10 text-turmeric">KS</Avatar>
        <div className="flex-1">
          <p className="text-[13px] font-semibold">Dr. Kriti Singh</p>
          <p className="text-[10.5px] text-cream/60">Ayurveda · Holistic health</p>
        </div>
        <span className="flex items-center gap-1 rounded-full bg-cream/10 px-2 py-1 text-[10.5px] font-semibold">
          <Icon.Star className="size-3 text-turmeric" /> 5.0
        </span>
      </div>

      <p data-ui className="mx-4 mt-5 text-[11px] font-bold uppercase tracking-wider text-muted">October 2026</p>
      <div data-ui className="mx-4 mt-2 grid grid-cols-6 gap-1.5">
        {days.map(([d, n]) => (
          <span
            key={n}
            className={`flex flex-col items-center rounded-xl py-2 text-[10px] ${
              n === 7 ? 'bg-forest text-cream shadow-lg shadow-forest/30' : 'bg-sand/60 text-muted'
            }`}
          >
            {d}
            <span className={`mt-0.5 font-display text-[16px] ${n === 7 ? 'text-turmeric' : 'text-forest'}`}>{n}</span>
          </span>
        ))}
      </div>

      <div data-ui className="mx-4 mt-4 grid grid-cols-2 gap-1 rounded-full bg-sand/70 p-1 text-[11px] font-semibold">
        <span className="rounded-full py-1.5 text-center text-muted">Morning · 10:30</span>
        <span className="rounded-full bg-ivory py-1.5 text-center text-forest shadow-sm">Evening · 4:00</span>
      </div>

      <div data-ui className="mx-4 mt-3 grid grid-cols-3 gap-2">
        {slots.map(([t, s]) => (
          <span
            key={t}
            className={`rounded-xl border py-2.5 text-center text-[12px] font-semibold ${
              s === 'picked'
                ? 'border-turmeric bg-turmeric text-forest-deep'
                : s === 'taken'
                  ? 'border-transparent bg-sand/40 text-muted/50 line-through'
                  : 'border-forest/15 text-forest'
            }`}
          >
            {t} PM
          </span>
        ))}
      </div>

      <div className="mt-auto px-4">
        <div data-ui className="mb-2.5 flex items-center justify-center gap-1.5 text-[10.5px] text-muted">
          <Icon.Chat className="size-3.5 text-sage" /> Confirmation &amp; reminder on WhatsApp
        </div>
        <div data-ui className="flex items-center justify-between rounded-2xl bg-forest px-4 py-3.5 text-cream">
          <span className="text-[12.5px] font-semibold">Confirm · Wed 7 Oct, 5:30 PM</span>
          <Icon.Arrow className="size-4 text-turmeric" />
        </div>
      </div>
    </div>
  )
}

/* ---------- 02 Prakriti ---------- */

export function PrakritiScreen() {
  const doshas = [
    { name: 'Vata', pct: 45, color: '#8fa382', note: 'Air · Space' },
    { name: 'Pitta', pct: 35, color: '#e2a54a', note: 'Fire · Water' },
    { name: 'Kapha', pct: 20, color: '#b4613f', note: 'Earth · Water' },
  ]
  let offset = 25
  return (
    <div className="flex h-full flex-col pb-7">
      <TopBar title="Your Prakriti" sub="Assessed by Dr. Kriti Singh · 7 Oct" />

      <div data-ui className="relative mx-auto mt-4 size-40">
        <svg viewBox="0 0 42 42" className="size-full -rotate-0">
          <circle cx="21" cy="21" r="15.915" fill="none" stroke="#ece2d0" strokeWidth="4.2" />
          {doshas.map((d) => {
            const el = (
              <circle
                key={d.name}
                data-arc={d.pct - 1.2}
                cx="21"
                cy="21"
                r="15.915"
                fill="none"
                stroke={d.color}
                strokeWidth="4.2"
                strokeLinecap="round"
                strokeDasharray={`${d.pct - 1.2} ${101.2 - d.pct}`}
                strokeDashoffset={offset}
              />
            )
            offset -= d.pct
            return el
          })}
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-[9.5px] font-bold uppercase tracking-wider text-muted">Primary</span>
          <span className="font-display text-[19px] leading-tight text-forest">Vata–Pitta</span>
        </div>
      </div>

      <div className="mx-4 mt-3 space-y-2.5">
        {doshas.map((d) => (
          <div data-ui key={d.name} className="flex items-center gap-3 text-[11.5px]">
            <span className="w-11 font-semibold text-forest">{d.name}</span>
            <span className="relative h-1.5 flex-1 overflow-hidden rounded-full bg-sand">
              <span data-hbar className="absolute inset-y-0 left-0 rounded-full" style={{ width: `${d.pct * 2}%`, background: d.color }} />
            </span>
            <span className="w-8 text-right font-semibold tabular-nums text-forest">{d.pct}%</span>
          </div>
        ))}
      </div>

      <div data-ui className="mx-4 mt-4 rounded-2xl bg-forest p-3 text-cream">
        <div className="flex items-center justify-between text-[11px]">
          <span className="font-semibold">Nadi Pariksha</span>
          <span className="text-cream/60">Pulse reading</span>
        </div>
        <svg viewBox="0 0 240 40" className="mt-1.5 h-9 w-full" aria-hidden="true">
          <path
            data-pulse
            pathLength="1"
            d="M0 22h34l6-12 7 24 6-18 5 6h40l6-14 7 26 6-20 5 8h40l6-12 7 24 6-18 5 6h55"
            fill="none"
            stroke="#e2a54a"
            strokeWidth="1.8"
            strokeLinejoin="round"
            strokeLinecap="round"
          />
        </svg>
      </div>

      <p data-ui className="mx-4 mt-4 text-[10.5px] font-bold uppercase tracking-wider text-muted">Focus areas</p>
      <div data-ui className="mx-4 mt-2 flex flex-wrap gap-1.5">
        {['Digestion', 'Sleep', 'Joint stiffness', 'Stress'].map((t) => (
          <span key={t} className="rounded-full border border-forest/15 px-2.5 py-1 text-[11px] font-medium text-forest">
            {t}
          </span>
        ))}
      </div>
    </div>
  )
}

/* ---------- 03 Daily plan ---------- */

export function PlanScreen() {
  const items = [
    { t: '6:30 AM', title: 'Warm ginger water', meta: 'Diet · on waking', photo: PHOTOS.goldenMilk, done: true },
    { t: '7:00 AM', title: 'Anulom Vilom', meta: 'Yoga · 10 min', photo: PHOTOS.yogaSunrise, done: true },
    { t: '1:30 PM', title: 'Herbal churna', meta: 'Medicine · after lunch', photo: PHOTOS.mortar, done: true },
    { t: '6:00 PM', title: 'Chakra meditation', meta: 'Healing · 15 min', photo: PHOTOS.meditation, done: false },
    { t: '8:00 PM', title: 'Light dinner', meta: 'Diet · moong khichdi', photo: PHOTOS.thali, done: false },
  ]
  return (
    <div className="flex h-full flex-col pb-7">
      <TopBar
        title="Today's plan"
        sub="Wednesday, 14 October"
        right={
          <span className="relative grid size-10 place-items-center">
            <svg viewBox="0 0 42 42" className="absolute inset-0 -rotate-90">
              <circle cx="21" cy="21" r="15.915" fill="none" stroke="#ece2d0" strokeWidth="4" />
              <circle data-arc="60" cx="21" cy="21" r="15.915" fill="none" stroke="#173a2e" strokeWidth="4" strokeLinecap="round" strokeDasharray="60 40" />
            </svg>
            <span className="text-[10px] font-bold text-forest">3/5</span>
          </span>
        }
      />

      <div data-ui className="no-scrollbar mx-4 mt-4 flex gap-1.5 overflow-x-auto text-[11px] font-semibold">
        {['All', 'Diet', 'Yoga', 'Medicine', 'Healing'].map((t, i) => (
          <span key={t} className={`shrink-0 rounded-full px-3 py-1.5 ${i === 0 ? 'bg-forest text-cream' : 'bg-sand/70 text-muted'}`}>
            {t}
          </span>
        ))}
      </div>

      <ul className="mx-4 mt-3 space-y-2">
        {items.map((it) => (
          <li data-ui key={it.title} className="flex items-center gap-3 rounded-2xl border border-forest/[0.07] bg-white/60 p-2">
            <img src={img(it.photo, 120, 120)} alt="" className="size-11 shrink-0 rounded-xl object-cover" loading="lazy" />
            <div className="min-w-0 flex-1">
              <p className="text-[10px] font-semibold text-saffron">{it.t}</p>
              <p className={`truncate text-[12.5px] font-semibold ${it.done ? 'text-forest/50 line-through' : 'text-forest'}`}>
                {it.title}
              </p>
              <p className="truncate text-[10px] text-muted">{it.meta}</p>
            </div>
            <span
              className={`grid size-6 shrink-0 place-items-center rounded-full ${
                it.done ? 'bg-forest text-turmeric' : 'border-[1.5px] border-forest/20'
              }`}
            >
              {it.done && <Icon.Check className="size-3.5" />}
            </span>
          </li>
        ))}
      </ul>

      <div data-ui className="mx-4 mt-auto flex items-center gap-2 rounded-2xl bg-sand/60 px-3 py-2.5 text-[10.5px] text-muted">
        <LotusMark className="size-4 text-saffron" />
        Plan by Dr. Kriti Singh · updated weekly
      </div>
    </div>
  )
}

/* ---------- 04 Progress ---------- */

export function ProgressScreen() {
  const week = [
    ['M', 4],
    ['T', 5],
    ['W', 5],
    ['T', 6],
    ['F', 7],
    ['S', 7],
    ['S', 8],
  ]
  return (
    <div className="flex h-full flex-col pb-7">
      <TopBar title="Your progress" sub="Week 4 of your plan" />

      <div data-ui className="mx-4 mt-4 rounded-2xl border border-forest/[0.07] bg-white/60 p-3.5">
        <div className="flex items-baseline justify-between">
          <p className="text-[12px] font-semibold text-forest">How you feel</p>
          <p className="text-[10px] text-muted">Energy · self-reported</p>
        </div>
        <div className="mt-3 flex h-28 items-end gap-2">
          {week.map(([d, v], i) => (
            <div key={i} className="flex flex-1 flex-col items-center gap-1.5">
              <span
                data-bar
                className={`w-full rounded-lg ${i === week.length - 1 ? 'bg-turmeric' : 'bg-sage/60'}`}
                style={{ height: `${v * 11}px` }}
              />
              <span className="text-[9.5px] font-semibold text-muted">{d}</span>
            </div>
          ))}
        </div>
      </div>

      <div data-ui className="mx-4 mt-2.5 grid grid-cols-2 gap-2.5">
        <div className="rounded-2xl bg-sand/60 p-3">
          <p className="text-[10px] text-muted">Daily check-ins</p>
          <p className="font-display text-[22px] leading-tight text-forest">
            26<span className="text-[13px] text-muted">/28</span>
          </p>
        </div>
        <div className="rounded-2xl bg-sand/60 p-3">
          <p className="text-[10px] text-muted">Sleep, avg</p>
          <p className="font-display text-[22px] leading-tight text-forest">
            7.2<span className="text-[13px] text-muted"> h</span>
          </p>
        </div>
      </div>

      <div data-ui className="mx-4 mt-2.5 rounded-2xl bg-forest p-3.5 text-cream">
        <p className="text-[10px] font-bold uppercase tracking-wider text-turmeric">Next follow-up</p>
        <p className="mt-1 font-display text-[18px] leading-tight">Sat, 31 Oct · 5:30 PM</p>
        <p className="mt-2 flex items-center gap-1.5 text-[10.5px] text-cream/65">
          <Icon.Chat className="size-3.5 text-sage" /> Reminder will arrive on WhatsApp
        </p>
      </div>

      <div data-ui className="mx-4 mt-auto flex items-end gap-2">
        <Avatar className="size-8 bg-forest text-[11px] text-turmeric">KS</Avatar>
        <p className="rounded-2xl rounded-bl-md bg-sand/70 px-3 py-2 text-[11px] leading-snug text-forest">
          Lovely progress this week. Keep up the evening walk.
        </p>
      </div>
    </div>
  )
}

export const SCREENS = [BookingScreen, PrakritiScreen, PlanScreen, ProgressScreen]
