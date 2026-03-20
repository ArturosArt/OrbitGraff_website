import { useEffect, useRef } from 'react'

export default function GalleryLightbox({ piece, onClose }) {
  const lightboxRef = useRef(null)

  useEffect(() => {
    if (!piece) {
      return undefined
    }

    const previousOverflow = document.body.style.overflow

    function handleKeyDown(event) {
      if (event.key === 'Escape') {
        onClose()
      }
    }

    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', handleKeyDown)
    lightboxRef.current?.focus()

    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [onClose, piece])

  if (!piece) {
    return null
  }

  function handleBackdropClick(event) {
    if (event.target === event.currentTarget) {
      onClose()
    }
  }

  return (
    <div
      ref={lightboxRef}
      aria-label={`Artwork preview: ${piece.title}`}
      aria-modal="true"
      className="gallery-lightbox"
      role="dialog"
      tabIndex={-1}
      onClick={handleBackdropClick}
    >
      <div className="gallery-lightbox-shell">
        <button
          aria-label="Close selected artwork"
          className="gallery-lightbox-close"
          type="button"
          onClick={onClose}
        >
          <span aria-hidden="true">×</span>
        </button>

        <div className="gallery-lightbox-panel">
          <div className="gallery-lightbox-frame">
            <img alt={piece.alt} className="gallery-lightbox-image" src={piece.src} />
          </div>
        </div>
      </div>
    </div>
  )
}
