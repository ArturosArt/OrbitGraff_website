import { useState } from 'react'
import ArtCard from '../components/gallery/ArtCard.jsx'
import GalleryLightbox from '../components/gallery/GalleryLightbox.jsx'
import GalleryLoader from '../components/gallery/GalleryLoader.jsx'
import PageIntro from '../components/PageIntro.jsx'
import { galleryItems } from '../content/orbitSiteData.js'
import { useVisibleGalleryItems } from '../hooks/useVisibleGalleryItems.js'

export default function ArtWorkPage() {
  const [selectedPiece, setSelectedPiece] = useState(null)
  const { hasMore, loaderRef, visibleItems } = useVisibleGalleryItems(galleryItems)
  const hasGalleryItems = galleryItems.length > 0

  return (
    <>
      <PageIntro eyebrow="Orbit" title="Gallery" />

      <section className={`artwork-section ${selectedPiece ? 'is-lightbox-open' : ''}`}>
        {hasGalleryItems ? (
          <>
            <div className="art-grid">
              {visibleItems.map((piece, index) => (
                <ArtCard key={piece.id} index={index} piece={piece} onSelect={setSelectedPiece} />
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
