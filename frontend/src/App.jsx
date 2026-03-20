import { useEffect } from 'react'
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

function App() {
  const currentPath = normalizePath(window.location.pathname)
  const meta = routeMeta[currentPath] ?? routeMeta['/']
  const CurrentPage = pageByPath[currentPath] ?? HomePage

  useEffect(() => {
    document.title = meta.title

    const description = document.querySelector('meta[name="description"]')

    if (description) {
      description.setAttribute('content', meta.description)
    }
  }, [meta])

  return (
    <SiteShell currentPath={currentPath}>
      <CurrentPage />
    </SiteShell>
  )
}

export default App
