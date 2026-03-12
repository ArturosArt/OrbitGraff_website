import { useRef } from 'react'
import BouncingHead from './BouncingHead.jsx'
import Stage from './Stage.jsx'
import useBackgroundCycle from './useBackgroundCycle.js'
import useBouncingHead from './useBouncingHead.js'

function BouncingHeadScene() {
  const stageRef = useRef(null)
  const headRef = useRef(null)
  const { backgroundClassName, handleCornerCollision } = useBackgroundCycle()

  useBouncingHead(stageRef, headRef, handleCornerCollision)

  return (
    <Stage
      ref={stageRef}
      backgroundClassName={backgroundClassName}
    >
      <BouncingHead ref={headRef} />
    </Stage>
  )
}

export default BouncingHeadScene
