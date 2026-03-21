import { startTransition, useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import LoadingScreen from './components/LoadingScreen.jsx'
import SiteShell from './components/layout/SiteShell.jsx'
import { routeMeta } from './content/orbitSiteData.js'
import AboutPage from './pages/AboutPage.jsx'
import ArtWorkPage from './pages/ArtWorkPage.jsx'
import ContactPage from './pages/ContactPage.jsx'
import HomePage from './pages/HomePage.jsx'
import { normalizePath } from './utils/normalizePath.js'

const pageByPath = {
  '/': HomePage,
  '/about/': AboutPage,
  '/art-work/': ArtWorkPage,
  '/contact/': ContactPage,
}

const minimumLoadingScreenMs = 380
const maximumLoadingScreenMs = 5000
const galleryPath = '/art-work/'

function getCurrentPath() {
  return typeof window === 'undefined' ? '/' : normalizePath(window.location.pathname)
}

function getNow() {
  return typeof performance === 'undefined' ? 0 : performance.now()
}

function App() {
  const [currentPath, setCurrentPath] = useState(getCurrentPath)
  const [loadKey, setLoadKey] = useState(1)
  const [isLoadingScreenVisible, setIsLoadingScreenVisible] = useState(true)
  const activeLoadKeyRef = useRef(1)
  const loadStartedAtRef = useRef(0)
  const hideTimerRef = useRef(null)
  const failSafeTimerRef = useRef(null)
  const meta = routeMeta[currentPath] ?? routeMeta['/']
  const CurrentPage = pageByPath[currentPath] ?? HomePage

  const clearLoadingTimers = useCallback(() => {
    window.clearTimeout(hideTimerRef.current)
    window.clearTimeout(failSafeTimerRef.current)
  }, [])

  const armFailSafe = useCallback((loadId) => {
    window.clearTimeout(failSafeTimerRef.current)
    failSafeTimerRef.current = window.setTimeout(() => {
      if (activeLoadKeyRef.current === loadId) {
        setIsLoadingScreenVisible(false)
      }
    }, maximumLoadingScreenMs)
  }, [])

  const beginRouteLoad = useCallback(
    (nextPath, nextUrl = null, { preserveScroll = false } = {}) => {
      const loadId = activeLoadKeyRef.current + 1

      clearLoadingTimers()
      activeLoadKeyRef.current = loadId
      loadStartedAtRef.current = getNow()
      setLoadKey(loadId)
      setIsLoadingScreenVisible(true)

      if (nextUrl) {
        window.history.pushState({ path: nextPath }, '', nextUrl)
      }

      startTransition(() => {
        setCurrentPath(nextPath)
      })

      if (!preserveScroll) {
        window.scrollTo(0, 0)
      }

      armFailSafe(loadId)
    },
    [armFailSafe, clearLoadingTimers],
  )

  const hideLoadingScreen = useCallback(() => {
    window.clearTimeout(failSafeTimerRef.current)
    window.clearTimeout(hideTimerRef.current)

    const elapsedMs = getNow() - loadStartedAtRef.current
    const remainingMs = Math.max(0, minimumLoadingScreenMs - elapsedMs)

    hideTimerRef.current = window.setTimeout(() => {
      setIsLoadingScreenVisible(false)
    }, remainingMs)
  }, [])

  const handlePageReady = useCallback((readyLoadKey) => {
    if (readyLoadKey !== activeLoadKeyRef.current) {
      return
    }

    hideLoadingScreen()
  }, [hideLoadingScreen])

  useEffect(() => {
    document.title = meta.title

    const description = document.querySelector('meta[name="description"]')

    if (description) {
      description.setAttribute('content', meta.description)
    }
  }, [meta])

  useLayoutEffect(() => {
    loadStartedAtRef.current = getNow()
    armFailSafe(activeLoadKeyRef.current)

    return () => clearLoadingTimers()
  }, [armFailSafe, clearLoadingTimers])

  useEffect(() => {
    function handlePopState() {
      beginRouteLoad(normalizePath(window.location.pathname), null, { preserveScroll: true })
    }

    window.addEventListener('popstate', handlePopState)

    return () => window.removeEventListener('popstate', handlePopState)
  }, [beginRouteLoad])

  useEffect(() => {
    function handleDocumentClick(event) {
      if (
        event.defaultPrevented ||
        event.button !== 0 ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey
      ) {
        return
      }

      if (!(event.target instanceof Element)) {
        return
      }

      const anchor = event.target.closest('a')

      if (!anchor || !anchor.href || anchor.target === '_blank' || anchor.hasAttribute('download')) {
        return
      }

      const destination = new URL(anchor.href, window.location.href)

      if (destination.origin !== window.location.origin) {
        return
      }

      const nextPath = normalizePath(destination.pathname)
      const destinationHref = `${destination.pathname}${destination.search}${destination.hash}`
      const currentHref = `${window.location.pathname}${window.location.search}${window.location.hash}`

      if (!pageByPath[nextPath]) {
        return
      }

      event.preventDefault()

      if (destinationHref === currentHref) {
        return
      }

      beginRouteLoad(nextPath, destinationHref)
    }

    document.addEventListener('click', handleDocumentClick)

    return () => document.removeEventListener('click', handleDocumentClick)
  }, [beginRouteLoad])

  useEffect(() => {
    if (currentPath === galleryPath) {
      return undefined
    }

    const readyFrame = window.requestAnimationFrame(() => {
      hideLoadingScreen()
    })

    return () => window.cancelAnimationFrame(readyFrame)
  }, [currentPath, hideLoadingScreen, loadKey])

  return (
    <>
      <SiteShell currentPath={currentPath}>
        <CurrentPage loadKey={loadKey} onReady={handlePageReady} />
      </SiteShell>
      <LoadingScreen key={loadKey} isActive={isLoadingScreenVisible} />
    </>
  )
}

export default App
