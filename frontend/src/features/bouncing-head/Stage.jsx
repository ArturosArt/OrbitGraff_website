import { forwardRef } from 'react'

const Stage = forwardRef(function Stage(
  { backgroundClassName, children },
  ref,
) {
  return (
    <main
      ref={ref}
      className={`stage ${backgroundClassName}`}
    >
      {children}
    </main>
  )
})

export default Stage
