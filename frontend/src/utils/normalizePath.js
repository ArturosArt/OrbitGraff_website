export function normalizePath(pathname) {
  if (!pathname || pathname === '/') {
    return '/'
  }

  const cleanedPath = pathname.replace(/index\.html$/, '').replace(/\/+$/, '')
  const knownPaths = ['/about', '/art-work', '/contact']
  const matchedPath = knownPaths.find((path) => cleanedPath.endsWith(path))

  if (matchedPath) {
    return `${matchedPath}/`
  }

  return '/'
}
