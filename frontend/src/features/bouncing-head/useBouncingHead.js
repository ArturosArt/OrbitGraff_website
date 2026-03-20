import { useEffect, useEffectEvent, useRef, useState } from 'react'
import {
  angularVelocity,
  collisionDebounceDuration,
  headInitialStates,
  headInsets,
  pauseDuration,
} from './headConfig.js'
import {
  advanceMotion,
  applyHeadTransform,
  canRegisterCollision,
  clampPosition,
  createSpawnDataFromCollision,
  getAnchoredPosition,
  getHeadBody,
  getHeadBounds,
  getPositionFromBodyCenter,
  getStageHeadCapacity,
  resolveHeadCollision,
  resolveWallCollisions,
} from './headMotion.js'

const initialHeadIds = headInitialStates.map((_, index) => index)
const minimumHeadCount = initialHeadIds.length

function isCollisionKeyForHead(collisionKey, headId) {
  const [firstHeadId, secondHeadId] = collisionKey.split(':')

  return Number(firstHeadId) === headId || Number(secondHeadId) === headId
}

function useBouncingHead(stageRef, onCornerCollision) {
  const [headIds, setHeadIds] = useState(initialHeadIds)
  const headElementsRef = useRef(new Map())
  const headStatesRef = useRef([])
  const nextHeadIdRef = useRef(initialHeadIds.length)
  const pendingSpawnRef = useRef(new Map())
  const activeCollisionKeysRef = useRef(new Set())
  const lastSpawnCollisionAtRef = useRef(-Infinity)

  const handleCornerCollision = useEffectEvent(() => {
    onCornerCollision?.()
  })

  const spawnHead = useEffectEvent((spawnData) => {
    setHeadIds((currentHeadIds) => {
      const stage = stageRef.current
      const referenceHead =
        headElementsRef.current.get(currentHeadIds[0]) ??
        headElementsRef.current.values().next().value

      if (!stage || !referenceHead) {
        return currentHeadIds
      }

      const maxHeadCount = getStageHeadCapacity(
        stage,
        referenceHead,
        headInsets,
      )

      if (currentHeadIds.length >= maxHeadCount) {
        return currentHeadIds
      }

      const nextHeadId = nextHeadIdRef.current
      nextHeadIdRef.current += 1
      pendingSpawnRef.current.set(nextHeadId, spawnData)

      return [...currentHeadIds, nextHeadId]
    })
  })

  const registerHeadRef = (headId, node) => {
    if (node) {
      headElementsRef.current.set(headId, node)
      return
    }

    headElementsRef.current.delete(headId)
  }

  const removeHead = (headId) => {
    setHeadIds((currentHeadIds) => {
      if (
        currentHeadIds.length <= minimumHeadCount ||
        !currentHeadIds.includes(headId)
      ) {
        return currentHeadIds
      }

      headElementsRef.current.delete(headId)
      pendingSpawnRef.current.delete(headId)
      headStatesRef.current = headStatesRef.current.filter((headState) => {
        return headState.id !== headId
      })
      activeCollisionKeysRef.current = new Set(
        [...activeCollisionKeysRef.current].filter((collisionKey) => {
          return !isCollisionKeyForHead(collisionKey, headId)
        }),
      )

      return currentHeadIds.filter((currentHeadId) => {
        return currentHeadId !== headId
      })
    })
  }

  useEffect(() => {
    const stage = stageRef.current

    if (!stage) {
      return
    }

    const headStates = headStatesRef.current
    const nextHeadStates = []

    headIds.forEach((headId, index) => {
      const existingState = headStates.find((headState) => {
        return headState.id === headId
      })

      if (existingState) {
        existingState.head = headElementsRef.current.get(headId) ?? existingState.head
        nextHeadStates.push(existingState)
        return
      }

      const head = headElementsRef.current.get(headId)

      if (!head) {
        return
      }

      const initialState = headInitialStates[index]
      const pendingSpawn = pendingSpawnRef.current.get(headId)
      const headState = {
        head,
        id: headId,
        pausedUntil: 0,
        position: { x: 0, y: 0 },
        rotation: pendingSpawn?.rotation ?? initialState?.rotation ?? 0,
        velocity: pendingSpawn?.velocity ?? {
          ...(initialState?.velocity ?? headInitialStates[0].velocity),
        },
      }
      const bounds = getHeadBounds(stage, headState.head, headInsets)

      if (pendingSpawn) {
        const position = getPositionFromBodyCenter(
          pendingSpawn.center,
          headState.head,
          headInsets,
        )

        headState.position.x = position.x
        headState.position.y = position.y
        clampPosition(headState.position, bounds)
        pendingSpawnRef.current.delete(headId)
      } else {
        const anchoredPosition = getAnchoredPosition(
          bounds,
          initialState.anchor,
        )

        headState.position.x = anchoredPosition.x
        headState.position.y = anchoredPosition.y
      }

      nextHeadStates.push(headState)
    })

    headStatesRef.current = nextHeadStates
    nextHeadStates.forEach((headState) => {
      applyHeadTransform(
        headState.head,
        headState.position,
        headState.rotation,
      )
    })
  }, [headIds, stageRef])

  useEffect(() => {
    const stage = stageRef.current

    if (!stage) {
      return undefined
    }

    let lastTime = 0
    let frameId = 0

    const render = () => {
      headStatesRef.current.forEach((headState) => {
        applyHeadTransform(
          headState.head,
          headState.position,
          headState.rotation,
        )
      })
    }

    const clampToStage = () => {
      headStatesRef.current.forEach((headState) => {
        const bounds = getHeadBounds(stage, headState.head, headInsets)
        clampPosition(headState.position, bounds)
      })

      render()
    }

    const tick = (time) => {
      if (lastTime === 0) {
        lastTime = time
      }

      const delta = (time - lastTime) / 1000
      lastTime = time

      let cornerCollisionDetected = false
      let collisionRegisteredThisFrame = false
      const activeCollisionKeys = new Set()
      const headStates = headStatesRef.current

      headStates.forEach((headState) => {
        if (time >= headState.pausedUntil) {
          advanceMotion(headState.position, headState.velocity, delta)
          headState.rotation =
            (headState.rotation + angularVelocity * delta) % 360
        }

        const bounds = getHeadBounds(stage, headState.head, headInsets)
        const { hitX, hitY } = resolveWallCollisions(
          headState.position,
          headState.velocity,
          bounds,
        )

        if (hitX && hitY) {
          headState.pausedUntil = time + pauseDuration
          cornerCollisionDetected = true
        }
      })

      for (let index = 0; index < headStates.length - 1; index += 1) {
        for (
          let otherIndex = index + 1;
          otherIndex < headStates.length;
          otherIndex += 1
        ) {
          const headAState = headStates[index]
          const headBState = headStates[otherIndex]
          const headABody = getHeadBody(
            headAState.position,
            headAState.head,
            headInsets,
          )
          const headBBody = getHeadBody(
            headBState.position,
            headBState.head,
            headInsets,
          )
          const collisionKey =
            headAState.id < headBState.id
              ? `${headAState.id}:${headBState.id}`
              : `${headBState.id}:${headAState.id}`
          const collided = resolveHeadCollision(
            headAState,
            headBState,
            headABody,
            headBBody,
          )

          if (collided) {
            activeCollisionKeys.add(collisionKey)

            if (
              !collisionRegisteredThisFrame &&
              !activeCollisionKeysRef.current.has(collisionKey) &&
              canRegisterCollision(
                lastSpawnCollisionAtRef.current,
                time,
                collisionDebounceDuration,
              )
            ) {
              const spawnData = createSpawnDataFromCollision(
                headABody,
                headBBody,
                headAState,
                headBState,
              )

              spawnHead(spawnData)
              lastSpawnCollisionAtRef.current = time
              collisionRegisteredThisFrame = true
            }
          }

          const headABounds = getHeadBounds(stage, headAState.head, headInsets)
          const headBBounds = getHeadBounds(stage, headBState.head, headInsets)
          clampPosition(headAState.position, headABounds)
          clampPosition(headBState.position, headBBounds)
        }
      }

      activeCollisionKeysRef.current = activeCollisionKeys

      if (cornerCollisionDetected) {
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
  }, [stageRef])

  return {
    canRemoveHeads: headIds.length > minimumHeadCount,
    headIds,
    registerHeadRef,
    removeHead,
  }
}

export default useBouncingHead
