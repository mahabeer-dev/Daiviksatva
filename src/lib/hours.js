// Clinic hours (India time): Monday to Saturday, two sessions a day.
export const SESSIONS = [
  { id: 'morning', label: 'Morning', from: 10 * 60 + 30, to: 13 * 60 },
  { id: 'evening', label: 'Evening', from: 16 * 60, to: 19 * 60 },
]

export const DAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
const SHORT = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

export const isOpenDay = (day) => day >= 1 && day <= 6

export function formatTime(minutes) {
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  const h12 = ((h + 11) % 12) + 1
  return `${h12}${m ? `:${String(m).padStart(2, '0')}` : ''} ${h < 12 ? 'AM' : 'PM'}`
}

export const sessionText = (s) => `${formatTime(s.from)} – ${formatTime(s.to)}`

/** Current weekday, minutes past midnight and calendar date in Asia/Kolkata. */
export function istNow(date = new Date()) {
  const parts = Object.fromEntries(
    new Intl.DateTimeFormat('en-GB', {
      timeZone: 'Asia/Kolkata',
      weekday: 'short',
      day: 'numeric',
      month: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hourCycle: 'h23',
    })
      .formatToParts(date)
      .map((p) => [p.type, p.value]),
  )
  return {
    day: SHORT.indexOf(parts.weekday),
    minutes: Number(parts.hour) * 60 + Number(parts.minute),
    date: new Date(Date.UTC(Number(parts.year), Number(parts.month) - 1, Number(parts.day))),
  }
}

export function clinicStatus(date = new Date()) {
  const { day, minutes } = istNow(date)
  if (isOpenDay(day)) {
    const current = SESSIONS.find((s) => minutes >= s.from && minutes < s.to)
    if (current) return { open: true, text: `Open now · until ${formatTime(current.to)}` }
    const next = SESSIONS.find((s) => minutes < s.from)
    if (next) return { open: false, text: `Closed now · opens ${formatTime(next.from)} today` }
  }
  let next = (day + 1) % 7
  while (!isOpenDay(next)) next = (next + 1) % 7
  const when = next === (day + 1) % 7 ? 'tomorrow' : DAY_NAMES[next]
  return { open: false, text: `Closed now · opens ${when}, ${formatTime(SESSIONS[0].from)}` }
}

/** The next `count` clinic days, starting today if a session is still ahead. */
export function upcomingDays(count = 6, date = new Date()) {
  const { day, minutes, date: today } = istNow(date)
  const days = []
  for (let offset = 0; days.length < count; offset++) {
    const d = (day + offset) % 7
    if (!isOpenDay(d)) continue
    if (offset === 0 && minutes >= SESSIONS[1].to) continue
    const when = new Date(today)
    when.setUTCDate(today.getUTCDate() + offset)
    days.push({
      key: when.toISOString().slice(0, 10),
      short: SHORT[d],
      num: when.getUTCDate(),
      label: `${SHORT[d]}, ${when.getUTCDate()} ${when.toLocaleString('en-GB', { month: 'short', timeZone: 'UTC' })}`,
      isToday: offset === 0,
      minutesNow: offset === 0 ? minutes : -1,
    })
  }
  return days
}
