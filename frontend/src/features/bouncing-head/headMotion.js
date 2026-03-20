export function applyHeadTransform(head, position, rotation) {
  head.style.setProperty('--head-x', `${position.x}px`)
  head.style.setProperty('--head-y', `${position.y}px`)
  head.style.setProperty('--head-rotation', `${rotation}deg`)
}

export function getHeadBounds(stage, head, headInsets) {
  const leftInset = head.offsetWidth * headInsets.left
  const topInset = head.offsetHeight * headInsets.top
  const rightInset = head.offsetWidth * headInsets.right
  const bottomInset = head.offsetHeight * headInsets.bottom

  return {
    minX: -leftInset,
    minY: -topInset,
    maxX: stage.clientWidth - head.offsetWidth + rightInset,
    maxY: stage.clientHeight - head.offsetHeight + bottomInset,
  }
}

export function clampPosition(position, bounds) {
  position.x = Math.min(Math.max(position.x, bounds.minX), bounds.maxX)
  position.y = Math.min(Math.max(position.y, bounds.minY), bounds.maxY)
}

export function getCenteredPosition(bounds) {
  return {
    x: (bounds.minX + bounds.maxX) / 2,
    y: (bounds.minY + bounds.maxY) / 2,
  }
}

export function getAnchoredPosition(bounds, anchor) {
  return {
    x: bounds.minX + (bounds.maxX - bounds.minX) * anchor.x,
    y: bounds.minY + (bounds.maxY - bounds.minY) * anchor.y,
  }
}

export function getPositionFromBodyCenter(center, head, headInsets) {
  const visibleWidth =
    head.offsetWidth * (1 - headInsets.left - headInsets.right)
  const visibleHeight =
    head.offsetHeight * (1 - headInsets.top - headInsets.bottom)

  return {
    x:
      center.x - visibleWidth / 2 - head.offsetWidth * headInsets.left,
    y:
      center.y - visibleHeight / 2 - head.offsetHeight * headInsets.top,
  }
}

export function getHeadBody(position, head, headInsets) {
  const visibleWidth =
    head.offsetWidth * (1 - headInsets.left - headInsets.right)
  const visibleHeight =
    head.offsetHeight * (1 - headInsets.top - headInsets.bottom)
  const left = position.x + head.offsetWidth * headInsets.left
  const top = position.y + head.offsetHeight * headInsets.top

  return {
    centerX: left + visibleWidth / 2,
    centerY: top + visibleHeight / 2,
    radius: Math.min(visibleWidth, visibleHeight) / 2,
  }
}

export function getStageHeadCapacity(stage, head, headInsets) {
  const { radius } = getHeadBody({ x: 0, y: 0 }, head, headInsets)
  const diameter = radius * 2

  if (diameter === 0) {
    return 0
  }

  const columns = Math.max(1, Math.floor(stage.clientWidth / diameter))
  const rows = Math.max(1, Math.floor(stage.clientHeight / diameter))

  return columns * rows
}

export function advanceMotion(position, velocity, delta) {
  position.x += velocity.x * delta
  position.y += velocity.y * delta
}

export function canRegisterCollision(
  lastCollisionTime,
  currentTime,
  debounceDuration,
) {
  return currentTime - lastCollisionTime >= debounceDuration
}

export function resolveWallCollisions(position, velocity, bounds) {
  let hitX = false
  let hitY = false

  if (position.x <= bounds.minX) {
    position.x = bounds.minX
    velocity.x = Math.abs(velocity.x)
    hitX = true
  } else if (position.x >= bounds.maxX) {
    position.x = bounds.maxX
    velocity.x = -Math.abs(velocity.x)
    hitX = true
  }

  if (position.y <= bounds.minY) {
    position.y = bounds.minY
    velocity.y = Math.abs(velocity.y)
    hitY = true
  } else if (position.y >= bounds.maxY) {
    position.y = bounds.maxY
    velocity.y = -Math.abs(velocity.y)
    hitY = true
  }

  return { hitX, hitY }
}

export function createSpawnDataFromCollision(
  headABody,
  headBBody,
  headAState,
  headBState,
) {
  const dx = headBBody.centerX - headABody.centerX
  const dy = headBBody.centerY - headABody.centerY
  const distance = Math.hypot(dx, dy)
  const normalX = distance === 0 ? 1 : dx / distance
  const normalY = distance === 0 ? 0 : dy / distance
  const tangentX = -normalY
  const tangentY = normalX
  const radiusOffset = Math.min(headABody.radius, headBBody.radius) * 1.15
  const speed =
    (Math.hypot(headAState.velocity.x, headAState.velocity.y) +
      Math.hypot(headBState.velocity.x, headBState.velocity.y)) /
      2 || 220

  return {
    center: {
      x:
        (headABody.centerX + headBBody.centerX) / 2 +
        tangentX * radiusOffset,
      y:
        (headABody.centerY + headBBody.centerY) / 2 +
        tangentY * radiusOffset,
    },
    rotation: (headAState.rotation + headBState.rotation) / 2,
    velocity: {
      x: tangentX * speed,
      y: tangentY * speed,
    },
  }
}

export function resolveHeadCollision(
  headAState,
  headBState,
  headABody,
  headBBody,
) {
  const dx = headBBody.centerX - headABody.centerX
  const dy = headBBody.centerY - headABody.centerY
  const distance = Math.hypot(dx, dy)
  const minDistance = headABody.radius + headBBody.radius

  if (distance >= minDistance || minDistance === 0) {
    return false
  }

  const normalX = distance === 0 ? 1 : dx / distance
  const normalY = distance === 0 ? 0 : dy / distance
  const overlap = minDistance - Math.max(distance, 0.0001)

  headAState.position.x -= normalX * (overlap / 2)
  headAState.position.y -= normalY * (overlap / 2)
  headBState.position.x += normalX * (overlap / 2)
  headBState.position.y += normalY * (overlap / 2)

  const headANormalVelocity =
    headAState.velocity.x * normalX + headAState.velocity.y * normalY
  const headBNormalVelocity =
    headBState.velocity.x * normalX + headBState.velocity.y * normalY
  const separatingSpeed = headBNormalVelocity - headANormalVelocity

  if (separatingSpeed >= 0) {
    return true
  }

  headAState.velocity.x +=
    (headBNormalVelocity - headANormalVelocity) * normalX
  headAState.velocity.y +=
    (headBNormalVelocity - headANormalVelocity) * normalY
  headBState.velocity.x +=
    (headANormalVelocity - headBNormalVelocity) * normalX
  headBState.velocity.y +=
    (headANormalVelocity - headBNormalVelocity) * normalY

  return true
}
