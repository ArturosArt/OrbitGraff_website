import BouncingHead from './BouncingHead.jsx'

function BouncingHeads({
  canRemoveHeads,
  headIds,
  removeHead,
  registerHeadRef,
}) {
  return headIds.map((headId) => {
    return (
      <BouncingHead
        key={headId}
        removable={canRemoveHeads}
        onRemove={() => removeHead(headId)}
        ref={(node) => registerHeadRef(headId, node)}
      />
    )
  })
}

export default BouncingHeads
