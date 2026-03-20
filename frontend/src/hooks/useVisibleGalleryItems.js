import { startTransition, useEffect, useRef, useState } from 'react'

export function useVisibleGalleryItems(items, pageSize = 9, rootMargin = '280px 0px') {
  const [visibleCount, setVisibleCount] = useState(() => Math.min(pageSize, items.length))
  const loaderRef = useRef(null)

  useEffect(() => {
    if (visibleCount >= items.length || !loaderRef.current) {
      return undefined
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries

        if (!entry?.isIntersecting) {
          return
        }

        observer.disconnect()
        startTransition(() => {
          setVisibleCount((currentCount) => Math.min(currentCount + pageSize, items.length))
        })
      },
      { rootMargin },
    )

    observer.observe(loaderRef.current)

    return () => observer.disconnect()
  }, [items.length, pageSize, rootMargin, visibleCount])

  return {
    hasMore: visibleCount < items.length,
    loaderRef,
    visibleItems: items.slice(0, visibleCount),
  }
}
