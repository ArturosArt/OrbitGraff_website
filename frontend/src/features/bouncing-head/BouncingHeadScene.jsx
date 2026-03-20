import { useRef } from 'react'
import BouncingHeadStage from './BouncingHeadStage.jsx'
import useBackgroundCycle from './useBackgroundCycle.js'
import useBouncingHead from './useBouncingHead.js'

function BouncingHeadScene() {
  const stageRef = useRef(null)
  const { backgroundClassName, handleCornerCollision } = useBackgroundCycle()
  const { canRemoveHeads, headIds, registerHeadRef, removeHead } = useBouncingHead(
    stageRef,
    handleCornerCollision,
  )

  return (
    <BouncingHeadStage
      canRemoveHeads={canRemoveHeads}
      stageRef={stageRef}
      headIds={headIds}
      removeHead={removeHead}
      registerHeadRef={registerHeadRef}
      backgroundClassName={backgroundClassName}
    />
  )
}

export default BouncingHeadScene
