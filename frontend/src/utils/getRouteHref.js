function toSegments(path) {
  if (!path || path === '/') {
    return []
  }

  return path.replace(/^\/+|\/+$/g, '').split('/')
}

export function getRouteHref(currentPath, targetPath) {
  if (currentPath === targetPath) {
    return './'
  }

  const currentSegments = toSegments(currentPath)
  const targetSegments = toSegments(targetPath)
  const upwardPrefix = currentSegments.length > 0 ? '../'.repeat(currentSegments.length) : './'
  const targetSuffix = targetSegments.length > 0 ? `${targetSegments.join('/')}/` : ''

  return `${upwardPrefix}${targetSuffix}`
}
