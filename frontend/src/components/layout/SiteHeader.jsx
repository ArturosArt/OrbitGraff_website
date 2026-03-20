import { useState } from 'react'
import MenuToggle from './MenuToggle.jsx'
import SiteBrand from './SiteBrand.jsx'
import SiteNavigation from './SiteNavigation.jsx'

export default function SiteHeader({ currentPath }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

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
    </header>
  )
}
