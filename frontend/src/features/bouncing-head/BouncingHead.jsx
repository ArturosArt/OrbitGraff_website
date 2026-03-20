import { forwardRef } from 'react'
import BouncingHeadVideo from './BouncingHeadVideo.jsx'
import BouncingHeadSources from './BouncingHeadSources.jsx'

const BouncingHead = forwardRef(function BouncingHead(
  { onRemove, removable },
  ref,
) {
  return (
    <BouncingHeadVideo
      ref={ref}
      onRemove={onRemove}
      removable={removable}
    >
      <BouncingHeadSources />
    </BouncingHeadVideo>
  )
})

export default BouncingHead
