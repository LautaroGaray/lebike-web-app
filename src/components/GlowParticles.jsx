import { useEffect, useRef } from 'react'

export function GlowParticles() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const context = canvas.getContext('2d')
    const particles = []
    let frameId
    let dimensions = { width: 0, height: 0, ratio: 1 }

    const resize = () => {
      const ratio = Math.min(window.devicePixelRatio || 1, 2)
      dimensions = { width: window.innerWidth, height: window.innerHeight, ratio }
      canvas.width = dimensions.width * ratio
      canvas.height = dimensions.height * ratio
      canvas.style.width = `${dimensions.width}px`
      canvas.style.height = `${dimensions.height}px`
      context.setTransform(ratio, 0, 0, ratio, 0, 0)
    }

    const addParticle = () => {
      particles.push({
        x: Math.random() * dimensions.width,
        y: Math.random() * dimensions.height,
        radius: 0.7 + Math.random() * 2,
        alpha: 0,
        targetAlpha: 0.18 + Math.random() * 0.46,
        life: 0,
        maxLife: 130 + Math.random() * 220,
        driftX: (Math.random() - 0.5) * 0.18,
        driftY: (Math.random() - 0.5) * 0.12,
      })
    }

    const render = () => {
      context.clearRect(0, 0, dimensions.width, dimensions.height)
      if (particles.length < 34 && Math.random() > 0.72) addParticle()
      particles.forEach((particle, index) => {
        particle.life += 1
        particle.x += particle.driftX
        particle.y += particle.driftY
        const progress = particle.life / particle.maxLife
        const envelope = progress < 0.32 ? progress / 0.32 : Math.max(0, 1 - ((progress - 0.32) / 0.68))
        particle.alpha += (particle.targetAlpha * envelope - particle.alpha) * 0.06
        const gradient = context.createRadialGradient(particle.x, particle.y, 0, particle.x, particle.y, particle.radius * 8)
        gradient.addColorStop(0, `rgba(185, 226, 255, ${particle.alpha})`)
        gradient.addColorStop(0.24, `rgba(112, 190, 255, ${particle.alpha * 0.52})`)
        gradient.addColorStop(1, 'rgba(60, 140, 225, 0)')
        context.fillStyle = gradient
        context.beginPath()
        context.arc(particle.x, particle.y, particle.radius * 8, 0, Math.PI * 2)
        context.fill()
        if (particle.life >= particle.maxLife) particles.splice(index, 1)
      })
      frameId = requestAnimationFrame(render)
    }

    resize()
    window.addEventListener('resize', resize)
    frameId = requestAnimationFrame(render)
    return () => {
      cancelAnimationFrame(frameId)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return <canvas ref={canvasRef} className="glow-particles" aria-hidden="true" />
}
