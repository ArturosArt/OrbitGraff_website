import { useEffect, useState } from 'react'
import MenuToggle from './MenuToggle.jsx'
import SiteBrand from './SiteBrand.jsx'
import SiteNavigation from './SiteNavigation.jsx'

export default function SiteHeader({ currentPath }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  useEffect(() => {
    if (!isMenuOpen) {
      return undefined
    }

    const scrollY = window.scrollY
    const previousBodyStyles = {
      overflow: document.body.style.overflow,
      position: document.body.style.position,
      top: document.body.style.top,
      width: document.body.style.width,
    }
    const previousHtmlOverflow = document.documentElement.style.overflow

    document.body.style.overflow = 'hidden'
    document.body.style.position = 'fixed'
    document.body.style.top = `-${scrollY}px`
    document.body.style.width = '100%'
    document.documentElement.style.overflow = 'hidden'

    return () => {
      document.body.style.overflow = previousBodyStyles.overflow
      document.body.style.position = previousBodyStyles.position
      document.body.style.top = previousBodyStyles.top
      document.body.style.width = previousBodyStyles.width
      document.documentElement.style.overflow = previousHtmlOverflow
      window.scrollTo(0, scrollY)
    }
  }, [isMenuOpen])

  function toggleMenu() {
    setIsMenuOpen((currentValue) => !currentValue)
  }

  return (
    <header className={`site-header ${isMenuOpen ? 'is-menu-open' : ''}`}>
      <div className="site-header-bar">
        <SiteBrand currentPath={currentPath} />
        <MenuToggle isMenuOpen={isMenuOpen} onToggle={toggleMenu} />
      </div>

      <SiteNavigation
        currentPath={currentPath}
        isMenuOpen={isMenuOpen}
        onNavigate={() => setIsMenuOpen(false)}
      />

      <button
        aria-label="Close navigation menu"
        className={`site-nav-backdrop ${isMenuOpen ? 'is-open' : ''}`}
        type="button"
        onClick={() => setIsMenuOpen(false)}
      />
    </header>
  )
}
