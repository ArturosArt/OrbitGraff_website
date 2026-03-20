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

  return (
    <article className={`art-card reveal ${delayClass}`}>
      <button
        aria-haspopup="dialog"
        aria-label={`Open ${piece.title}`}
        className="art-card-button"
        type="button"
        onClick={() => onSelect(piece)}
      >
        <img alt={piece.alt} className="art-image" decoding="async" loading="lazy" src={piece.src} />
      </button>
    </article>
  )
}
