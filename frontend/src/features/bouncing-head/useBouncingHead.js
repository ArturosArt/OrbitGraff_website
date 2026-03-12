import { useEffect, useEffectEvent } from 'react'
import {
  angularVelocity,
  headInsets,
  initialPosition,
  initialVelocity,
  pauseDuration,
} from './headConfig.js'
import {
  advanceMotion,
  applyHeadTransform,
  clampPosition,
  getHeadBounds,
  resolveWallCollisions,
} from './headMotion.js'

function useBouncingHead(stageRef, headRef, onCornerCollision) {
  const handleCornerCollision = useEffectEvent(() => {
    onCornerCollision?.()
  })

  useEffect(() => {
    const stage = stageRef.current
    const head = headRef.current

    if (!stage || !head) {
      return undefined
    }

    const position = { ...initialPosition }
    const velocity = { ...initialVelocity }
    let rotation = 0
    let pausedUntil = 0
    let lastTime = 0
    let frameId = 0

    const render = () => {
      applyHeadTransform(head, position, rotation)
    }

    const clampToStage = () => {
      const bounds = getHeadBounds(stage, head, headInsets)
      clampPosition(position, bounds)
      render()
    }

    const tick = (time) => {
      if (lastTime === 0) {
        lastTime = time
      }

      if (time < pausedUntil) {
        lastTime = time
        frameId = window.requestAnimationFrame(tick)
        return
      }

      const delta = (time - lastTime) / 1000
      lastTime = time

      const bounds = getHeadBounds(stage, head, headInsets)
      advanceMotion(position, velocity, delta)
      rotation = (rotation + angularVelocity * delta) % 360

      const { hitX, hitY } = resolveWallCollisions(position, velocity, bounds)

      if (hitX && hitY) {
        pausedUntil = time + pauseDuration
        handleCornerCollision()
      }

      render()
      frameId = window.requestAnimationFrame(tick)
    }

    const handleResize = () => {
      clampToStage()
    }

    clampToStage()
    frameId = window.requestAnimationFrame(tick)
    window.addEventListener('resize', handleResize)

    return () => {
      window.cancelAnimationFrame(frameId)
      window.removeEventListener('resize', handleResize)
    }
  }, [stageRef, headRef])
}

export default useBouncingHead
