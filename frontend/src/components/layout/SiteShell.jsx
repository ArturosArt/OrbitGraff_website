import SiteFooter from './SiteFooter.jsx'
import SiteHeader from './SiteHeader.jsx'

export default function SiteShell({ children, currentPath }) {
  const pageShellClassName = currentPath === '/' ? 'page-shell page-shell-home' : 'page-shell'

  return (
    <div className="site-shell">
      <SiteHeader key={currentPath} currentPath={currentPath} />
      <main className={pageShellClassName}>{children}</main>
      <SiteFooter currentPath={currentPath} />
    </div>
  )
}
