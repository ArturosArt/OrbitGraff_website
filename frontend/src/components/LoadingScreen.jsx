import { useState } from 'react'
import { resolveAssetHref } from '../utils/resolveAssetHref.js'

export default function LoadingScreen({ isActive }) {
  const [showFallback, setShowFallback] = useState(true)

  return (
    <div aria-hidden={!isActive} className={`loading-screen ${isActive ? 'is-active' : ''}`}>
      {showFallback ? (
        <img
          alt=""
          aria-hidden="true"
          className="loading-screen-fallback"
          src={resolveAssetHref('/orbit_transparent_fallback.png')}
        />
      ) : null}
      <video
        aria-hidden="true"
        autoPlay
        className={`loading-screen-video ${showFallback ? 'is-hidden' : ''}`}
        loop
        muted
        onCanPlay={() => setShowFallback(false)}
        onLoadedData={() => setShowFallback(false)}
        onPlaying={() => setShowFallback(false)}
        playsInline
        poster={resolveAssetHref('/orbit_transparent_fallback.png')}
        preload="auto"
      >
        <source src={resolveAssetHref('/orbit_transparent_fast.webm')} type="video/webm" />
        <source src={resolveAssetHref('/orbit_transparent_fast.mov')} type="video/quicktime" />
      </video>
    </div>
  )
}
