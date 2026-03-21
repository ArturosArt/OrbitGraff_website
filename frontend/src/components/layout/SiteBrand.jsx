import { getRouteHref } from '../../utils/getRouteHref.js'
import { resolveAssetHref } from '../../utils/resolveAssetHref.js'

export default function SiteBrand({ currentPath }) {
  return (
    <a className="site-brand" href={getRouteHref(currentPath, '/')}>
      <span className="site-brand-mark">
        <img alt="Orbit logo" className="site-brand-image" src={resolveAssetHref('/icon.jpg')} />
      </span>
      <span className="site-brand-text">
        <strong>Orbit</strong>
        <small>Graff</small>
      </span>
    </a>
  )
}
