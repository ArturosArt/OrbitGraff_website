import BouncingHeads from './BouncingHeads.jsx'
import Stage from './Stage.jsx'

function BouncingHeadStage({
  backgroundClassName,
  canRemoveHeads,
  headIds,
  removeHead,
  registerHeadRef,
  stageRef,
}) {
  return (
    <Stage
      ref={stageRef}
      backgroundClassName={backgroundClassName}
    >
      <BouncingHeads
        canRemoveHeads={canRemoveHeads}
        headIds={headIds}
        removeHead={removeHead}
        registerHeadRef={registerHeadRef}
      />
    </Stage>
  )
}

export default BouncingHeadStage
