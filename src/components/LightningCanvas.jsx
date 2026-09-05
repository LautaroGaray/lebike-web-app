import { useEffect, useRef } from 'react'

const randomBetween = (min, max) => min + Math.random() * (max - min)

function createBolt(width, height) {
  const startX = randomBetween(width * 0.08, width * 0.92)
  const endY = randomBetween(height * 0.34, height * 0.82)
  const segments = Math.floor(randomBetween(8, 15))
  const points = [{ x: startX, y: randomBetween(-30, height * 0.08) }]
  const direction = Math.random() > 0.5 ? 1 : -1
  const stepY = (endY - points[0].y) / segments

  for (let index = 1; index <= segments; index += 1) {
    const previous = points[index - 1]
    points.push({
      x: previous.x + direction * randomBetween(12, Math.max(24, width * 0.045)),
      y: previous.y + stepY * randomBetween(0.72, 1.18),
    })
  }

  return points
}

function drawPath(context, points, lineWidth, alpha, color, blur = 0) {
  context.save()
  context.globalAlpha = alpha
  context.strokeStyle = color
  context.lineWidth = lineWidth
  context.lineCap = 'round'
  context.lineJoin = 'bevel'
  context.shadowColor = color
  context.shadowBlur = blur
  context.beginPath()
  points.forEach((point, index) => (index === 0 ? context.moveTo(point.x, point.y) : context.lineTo(point.x, point.y)))
  context.stroke()
  context.restore()
}

function drawBranches(context, points, intensity) {
  points.forEach((point, index) => {
    if (index < 2 || index > points.length - 2 || Math.random() > 0.48) return
    const direction = Math.random() > 0.5 ? 1 : -1
    const branch = [{ x: point.x, y: point.y }]
    const length = Math.floor(randomBetween(2, 4))
    for (let step = 0; step < length; step += 1) {
      const previous = branch[branch.length - 1]
      branch.push({ x: previous.x + direction * randomBetween(10, 30), y: previous.y + randomBetween(8, 24) })
    }
    drawPath(context, branch, 1.1, intensity * 0.7, '#bfe5ff', 5)
    drawPath(context, branch, 0.55, intensity, '#ffffff', 1)
  })
}

export function LightningCanvas() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const context = canvas.getContext('2d')
    let frameId
    let timeoutId
    let activeStrike = null
    let dimensions = { width: 0, height: 0, ratio: 1 }

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined

    const resize = () => {
      const ratio = Math.min(window.devicePixelRatio || 1, 2)
      dimensions = { width: window.innerWidth, height: window.innerHeight, ratio }
      canvas.width = dimensions.width * ratio
      canvas.height = dimensions.height * ratio
      canvas.style.width = `${dimensions.width}px`
      canvas.style.height = `${dimensions.height}px`
      context.setTransform(ratio, 0, 0, ratio, 0, 0)
    }

    const scheduleStrike = () => {
      timeoutId = window.setTimeout(() => {
        timeoutId = undefined
        const boltCount = Math.random() > 0.72 ? 2 : 1
        activeStrike = { startedAt: performance.now(), duration: randomBetween(190, 420), bolts: Array.from({ length: boltCount }, () => createBolt(dimensions.width, dimensions.height)) }
      }, randomBetween(850, 2600))
    }

    const render = (now) => {
      const { width, height } = dimensions
      context.clearRect(0, 0, width, height)
      if (activeStrike) {
        const elapsed = now - activeStrike.startedAt
        if (elapsed > activeStrike.duration) {
          activeStrike = null
          scheduleStrike()
        } else {
          const flicker = Math.random() > 0.74 ? 0.18 : 1
          const intensity = Math.max(0, 1 - elapsed / activeStrike.duration) * flicker
          if (intensity > 0.35) {
            context.fillStyle = `rgba(124, 190, 255, ${intensity * 0.055})`
            context.fillRect(0, 0, width, height)
          }
          activeStrike.bolts.forEach((bolt) => {
            drawPath(context, bolt, 12, intensity * 0.22, '#2e8de0', 24)
            drawPath(context, bolt, 4, intensity * 0.7, '#75bfff', 12)
            drawPath(context, bolt, 1.25, intensity, '#f5fbff', 4)
            drawBranches(context, bolt, intensity)
          })
        }
      } else if (!timeoutId) {
        scheduleStrike()
      }
      frameId = requestAnimationFrame(render)
    }

    resize()
    window.addEventListener('resize', resize)
    frameId = requestAnimationFrame(render)
    return () => {
      cancelAnimationFrame(frameId)
      window.clearTimeout(timeoutId)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return <canvas ref={canvasRef} className="lightning-canvas" aria-hidden="true" />
}
