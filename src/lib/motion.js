import Lenis from 'lenis'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export { gsap, ScrollTrigger }

export const MOTION_OK = '(prefers-reduced-motion: no-preference)'

export const prefersReducedMotion = () =>
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

let lenis = null

export function initLenis() {
  if (prefersReducedMotion()) return null

  lenis = new Lenis({ lerp: 0.085, smoothWheel: true, wheelMultiplier: 0.9 })
  lenis.on('scroll', ScrollTrigger.update)

  const tick = (time) => lenis?.raf(time * 1000)
  gsap.ticker.add(tick)
  gsap.ticker.lagSmoothing(0)

  return () => {
    gsap.ticker.remove(tick)
    lenis?.destroy()
    lenis = null
  }
}

export const getLenis = () => lenis

export function scrollToTarget(selector) {
  const el = document.querySelector(selector)
  if (!el) return
  if (lenis) lenis.scrollTo(el, { offset: -24, duration: 1.6 })
  else el.scrollIntoView({ behavior: prefersReducedMotion() ? 'auto' : 'smooth' })
}

/** Standard section heading entrance: masked words rise, then supporting copy fades up. */
export function revealHead(head) {
  if (!head) return
  gsap.fromTo(
    head.querySelectorAll('[data-word]'),
    { yPercent: 115 },
    {
      yPercent: 0,
      duration: 1.1,
      stagger: 0.06,
      ease: 'power4.out',
      scrollTrigger: { trigger: head, start: 'top 80%', once: true },
    },
  )
  gsap.fromTo(
    head.querySelectorAll('[data-fade]'),
    { autoAlpha: 0, y: 28 },
    {
      autoAlpha: 1,
      y: 0,
      duration: 1,
      stagger: 0.1,
      ease: 'power4.out',
      scrollTrigger: { trigger: head, start: 'top 76%', once: true },
    },
  )
}

// Unsplash images, sized on request. Swap for the clinic's own photos before launch.
export const img = (id, w = 1200, h) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}${h ? `&h=${h}` : ''}&q=75`

export const PHOTOS = {
  shirodhara: 'photo-1775133263714-848c8fe09e73',
  herbsHand: 'photo-1659817674898-3564a596737c',
  goldenMilk: 'photo-1519110756001-72f90e894646',
  yogaSunrise: 'photo-1506126613408-eca07ce68773',
  mortar: 'photo-1492552085122-36706c238263',
  thali: 'photo-1521146250551-a5578dcc2e64',
  meditation: 'photo-1517363898874-737b62a7db91',
  apothecary: 'photo-1545840716-c82e9eec6930',
  spices: 'photo-1581600140682-d4e68c8cde32',
  herbalTea: 'photo-1514733670139-4d87a1941d55',
}
