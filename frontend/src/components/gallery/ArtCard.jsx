import { useState } from 'react'

function getRevealDelayClass(index) {
  if (index % 3 === 1) {
    return 'reveal-delay-1'
  }

  if (index % 3 === 2) {
    return 'reveal-delay-2'
  }

  return ''
}

export default function ArtCard({ piece, index, onSelect }) {
  const delayClass = getRevealDelayClass(index)
  const [imageSrc, setImageSrc] = useState(piece.thumbSrc ?? piece.src)

  return (
    <article className={`art-card reveal ${delayClass}`}>
      <button
        aria-haspopup="dialog"
        aria-label={`Open ${piece.title}`}
        className="art-card-button"
        type="button"
        onClick={() => onSelect(piece)}
      >
        <img
          alt={piece.alt}
          className="art-image"
          decoding="async"
          fetchPriority={index < 3 ? 'high' : 'auto'}
          loading={index < 6 ? 'eager' : 'lazy'}
          src={imageSrc}
          onError={() => {
            if (imageSrc !== piece.src) {
              setImageSrc(piece.src)
            }
          }}
        />
      </button>
    </article>
  )
}
