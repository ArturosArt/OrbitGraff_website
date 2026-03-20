import { normalizePath } from './normalizePath.js'

export function resolveAssetHref(path) {
  const normalizedPath = path.replace(/^\/+/, '')
  const currentPath = typeof window === 'undefined' ? '/' : normalizePath(window.location.pathname)
  const pathDepth = currentPath === '/' ? 0 : currentPath.replace(/^\/+|\/+$/g, '').split('/').length
  const relativePrefix = pathDepth > 0 ? '../'.repeat(pathDepth) : './'

  return `${relativePrefix}${normalizedPath}`
}
