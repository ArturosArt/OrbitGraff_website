import { resolveAssetHref } from '../utils/resolveAssetHref.js'

export default function LoadingScreen({ isActive }) {
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
      >
        <source src={resolveAssetHref('/orbit_transparent_fast.webm')} type="video/webm" />
        <source src={resolveAssetHref('/orbit_transparent_fast.mov')} type="video/quicktime" />
      </video>
    </div>
  )
}
