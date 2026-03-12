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

export function advanceMotion(position, velocity, delta) {
  position.x += velocity.x * delta
  position.y += velocity.y * delta
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
