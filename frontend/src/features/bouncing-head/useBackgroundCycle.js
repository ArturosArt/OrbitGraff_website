import { useState } from 'react'
import { backgroundClasses } from './backgroundClasses.js'

function useBackgroundCycle() {
  const [backgroundIndex, setBackgroundIndex] = useState(0)

  const handleCornerCollision = () => {
    setBackgroundIndex((currentIndex) => {
      return (currentIndex + 1) % backgroundClasses.length
    })
  }

  return {
    backgroundClassName: backgroundClasses[backgroundIndex],
    handleCornerCollision,
  }
}

export default useBackgroundCycle
