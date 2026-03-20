import { getRouteHref } from '../../utils/getRouteHref.js'

export default function SiteFooter({ currentPath }) {
  return (
    <footer className="site-footer">
      <p className="site-footer-credit">
        Built and maintained by{' '}
        <a href="https://compilingjava.com" rel="noreferrer" target="_blank">
          CompilingJava.com
        </a>
        .
      </p>
      <div className="site-footer-meta" aria-label="Footer details">
        <small>Chicago, Illinois</small>
        <small>2026</small>
        <small className="site-footer-rights">
          Artwork © Orbit. <a href={getRouteHref(currentPath, '/contact/')}>Use by permission.</a>
        </small>
      </div>
    </footer>
  )
}
