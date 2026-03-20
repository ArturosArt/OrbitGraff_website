export default function GalleryLoader({ hasMore, loaderRef }) {
  if (hasMore) {
    return <div ref={loaderRef} className="gallery-loader">Scroll for more</div>
  }

  return <div className="gallery-loader gallery-loader-complete">End of gallery</div>
}
