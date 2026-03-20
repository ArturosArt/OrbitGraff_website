export function resolveAssetHref(path) {
  const normalizedPath = path.replace(/^\/+/, '')

  return new URL(`../${normalizedPath}`, import.meta.url).href
}
