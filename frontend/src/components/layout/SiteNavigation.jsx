import { navigation } from '../../content/orbitSiteData.js'
import { getRouteHref } from '../../utils/getRouteHref.js'

export default function SiteNavigation({ currentPath, isMenuOpen, onNavigate }) {
  return (
    <nav className={`site-nav ${isMenuOpen ? 'is-open' : ''}`} id="site-nav" aria-label="Primary">
      {navigation.map((item) => {
        const active = item.href === currentPath

        return (
          <a
            key={item.href}
            className={`nav-link ${active ? 'is-active' : ''}`}
            href={getRouteHref(currentPath, item.href)}
            onClick={onNavigate}
          >
            {item.label}
          </a>
        )
      })}
    </nav>
  )
}
