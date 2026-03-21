import { useEffect, useState } from 'react'
import ArtCard from '../components/gallery/ArtCard.jsx'
import GalleryLightbox from '../components/gallery/GalleryLightbox.jsx'
import GalleryLoader from '../components/gallery/GalleryLoader.jsx'
import PageIntro from '../components/PageIntro.jsx'
import { galleryItems } from '../content/orbitSiteData.js'
import { useVisibleGalleryItems } from '../hooks/useVisibleGalleryItems.js'
import { resolveAssetHref } from '../utils/resolveAssetHref.js'

export default function ArtWorkPage({ loadKey, onReady }) {
  const [selectedPiece, setSelectedPiece] = useState(null)
  const resolvedGalleryItems = galleryItems.map((piece) => ({
    ...piece,
    src: resolveAssetHref(piece.src),
    thumbSrc: resolveAssetHref(piece.thumbSrc ?? piece.src),
  }))
  const { hasMore, loaderRef, visibleItems } = useVisibleGalleryItems(resolvedGalleryItems)
  const hasGalleryItems = resolvedGalleryItems.length > 0

  useEffect(() => {
    if (!hasGalleryItems) {
      onReady?.(loadKey)
      return undefined
    }

    let isCancelled = false
    const thumbnailSources = galleryItems.map((piece) => resolveAssetHref(piece.thumbSrc ?? piece.src))

    Promise.all(
      thumbnailSources.map(
        (thumbnailSource) =>
          new Promise((resolve) => {
            const image = new window.Image()

            function settle() {
              image.onload = null
              image.onerror = null
              resolve()
            }

            image.onload = settle
            image.onerror = settle
            image.decoding = 'async'
            image.src = thumbnailSource

            if (image.complete) {
              settle()
            }
          }),
      ),
    ).then(() => {
      if (!isCancelled) {
        onReady?.(loadKey)
      }
    })

    return () => {
      isCancelled = true
    }
  }, [hasGalleryItems, loadKey, onReady])

  return (
    <>
      <PageIntro eyebrow="Orbit" title="Gallery" />

      <section className={`artwork-section ${selectedPiece ? 'is-lightbox-open' : ''}`}>
        {hasGalleryItems ? (
          <>
            <div className="art-grid">
              {visibleItems.map((piece, index) => (
                <ArtCard
                  key={piece.id}
                  index={index}
                  piece={piece}
                  onSelect={setSelectedPiece}
                />
              ))}
            </div>

            <GalleryLoader hasMore={hasMore} loaderRef={loaderRef} />
          </>
        ) : (
          <p className="artwork-empty">No artwork in the gallery yet.</p>
        )}
      </section>

      <GalleryLightbox piece={selectedPiece} onClose={() => setSelectedPiece(null)} />
    </>
  )
}
