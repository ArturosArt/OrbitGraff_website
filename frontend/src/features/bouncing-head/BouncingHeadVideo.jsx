import { forwardRef } from 'react'
import { animationPlaybackRate } from './headConfig.js'

const BouncingHeadVideo = forwardRef(function BouncingHeadVideo(
  { children, onRemove, removable },
  ref,
) {
  const handleLoadedData = (event) => {
    event.currentTarget.playbackRate = animationPlaybackRate
  }

  const handleKeyDown = (event) => {
    if (!removable) {
      return
    }

    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      onRemove?.()
    }
  }

  const className = removable
    ? 'bouncing-head bouncing-head-removable'
    : 'bouncing-head bouncing-head-static'

  return (
    <video
      ref={ref}
      autoPlay
      loop
      muted
      playsInline
      preload="auto"
      onLoadedData={handleLoadedData}
      onClick={onRemove}
      onKeyDown={handleKeyDown}
      role={removable ? 'button' : undefined}
      tabIndex={removable ? 0 : -1}
      aria-label={removable ? 'Remove head' : undefined}
      className={className}
    >
      {children}
    </video>
  )
})

export default BouncingHeadVideo
