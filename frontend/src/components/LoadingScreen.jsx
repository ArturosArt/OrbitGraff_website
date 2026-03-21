import { useEffect, useRef } from 'react'
import { resolveAssetHref } from '../utils/resolveAssetHref.js'

export default function LoadingScreen({ isActive }) {
  const videoRef = useRef(null)

  useEffect(() => {
    const video = videoRef.current

    if (!video) {
      return
    }

    if (!isActive) {
      video.pause()
      return
    }

    video.currentTime = 0

    const playPromise = video.play()

    if (playPromise?.catch) {
      playPromise.catch(() => {})
    }
  }, [isActive])

  return (
    <div aria-hidden={!isActive} className={`loading-screen ${isActive ? 'is-active' : ''}`}>
      <video
        aria-hidden="true"
        autoPlay
        className="loading-screen-video"
        loop
        muted
        playsInline
        preload="auto"
        ref={videoRef}
      >
        <source src={resolveAssetHref('/orbit_transparent_fast.mov')} type="video/quicktime" />
        <source src={resolveAssetHref('/orbit_transparent_fast.webm')} type="video/webm" />
      </video>
    </div>
  )
}
