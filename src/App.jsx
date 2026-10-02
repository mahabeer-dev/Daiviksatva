import { useCallback, useLayoutEffect, useState } from 'react'
import { ScrollTrigger, getLenis, initLenis, prefersReducedMotion } from './lib/motion'
import Preloader from './components/Preloader'
import Nav from './components/Nav'
import Hero from './components/Hero'
import Treatments from './components/Treatments'
import Journey from './components/Journey'
import Doctors from './components/Doctors'
import Reviews from './components/Reviews'
import Visit from './components/Visit'
import Footer from './components/Footer'

export default function App() {
  const [ready, setReady] = useState(false)

  useLayoutEffect(() => {
    if ('scrollRestoration' in history) history.scrollRestoration = 'manual'
    window.scrollTo(0, 0)
    // The preloader is skipped for reduced motion, so only lock scrolling when it runs.
    if (!prefersReducedMotion()) document.documentElement.classList.add('is-loading')

    const destroyLenis = initLenis()
    getLenis()?.stop()

    // Re-measure scroll positions whenever the page height settles (web fonts, images).
    let timer
    const refresh = () => {
      clearTimeout(timer)
      timer = setTimeout(() => ScrollTrigger.refresh(), 150)
    }
    const ro = new ResizeObserver(refresh)
    ro.observe(document.body)
    window.addEventListener('load', refresh)

    return () => {
      clearTimeout(timer)
      ro.disconnect()
      window.removeEventListener('load', refresh)
      destroyLenis?.()
    }
  }, [])

  const handleLoaded = useCallback(() => {
    document.documentElement.classList.remove('is-loading')
    getLenis()?.start()
    setReady(true)
  }, [])

  return (
    <>
      <Preloader onDone={handleLoaded} />
      <Nav ready={ready} />
      <main>
        <Hero ready={ready} />
        <Treatments />
        <Journey />
        <Doctors />
        <Reviews />
        <Visit />
      </main>
      <Footer />
    </>
  )
}
