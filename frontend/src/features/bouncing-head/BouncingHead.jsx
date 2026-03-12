import { forwardRef } from 'react'

const BouncingHead = forwardRef(function BouncingHead(_, ref) {
  return (
    <img
      ref={ref}
      src="/icon.png"
      alt="OrbitGraff head"
      draggable="false"
      className="bouncing-head"
    />
  )
})

export default BouncingHead
