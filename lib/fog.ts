import type { Visit } from '@/types'

/**
 * Project a lng/lat coordinate to pixel position on the map canvas.
 */
export function lngLatToPixel(
  lng: number,
  lat: number,
  map: mapboxgl.Map
): { x: number; y: number } {
  const point = map.project([lng, lat])
  return { x: point.x, y: point.y }
}

/**
 * Convert a radius in kilometers to pixels at the current map zoom level.
 */
export function kmToPixels(km: number, lat: number, map: mapboxgl.Map): number {
  const metersPerPixel =
    (156543.03392 * Math.cos((lat * Math.PI) / 180)) /
    Math.pow(2, map.getZoom())
  return (km * 1000) / metersPerPixel
}

/**
 * Draw the fog overlay on the canvas.
 * 
 * 1. Fill the entire canvas with near-black fog.
 * 2. Use destination-out compositing to erase circles at visited locations.
 * 3. Each circle has a soft radial gradient edge.
 */
export function drawFog(
  canvas: HTMLCanvasElement,
  visits: Visit[],
  map: mapboxgl.Map,
  fogRadiusKm: number,
  opacity: number = 0.92
): void {
  const ctx = canvas.getContext('2d')
  if (!ctx) return

  // Resize canvas to match map container
  const container = map.getContainer()
  const dpr = window.devicePixelRatio || 1
  canvas.width = container.offsetWidth * dpr
  canvas.height = container.offsetHeight * dpr
  ctx.scale(dpr, dpr)

  // Fill with fog
  ctx.clearRect(0, 0, container.offsetWidth, container.offsetHeight)
  ctx.fillStyle = `rgba(14, 18, 28, ${opacity})`
  ctx.fillRect(0, 0, container.offsetWidth, container.offsetHeight)

  // Erase fog over each visited location
  ctx.globalCompositeOperation = 'destination-out'

  visits.forEach((visit) => {
    const { x, y } = lngLatToPixel(visit.lng, visit.lat, map)
    const pixelRadius = kmToPixels(fogRadiusKm, visit.lat, map)

    // Soft edge: radial gradient for natural reveal shape
    const gradient = ctx.createRadialGradient(x, y, 0, x, y, pixelRadius)
    gradient.addColorStop(0, 'rgba(0, 0, 0, 1)')       // fully revealed center
    gradient.addColorStop(0.7, 'rgba(0, 0, 0, 0.95)')  // still mostly revealed
    gradient.addColorStop(1, 'rgba(0, 0, 0, 0)')        // soft fog edge

    ctx.fillStyle = gradient
    ctx.beginPath()
    ctx.arc(x, y, pixelRadius, 0, Math.PI * 2)
    ctx.fill()
  })

  ctx.globalCompositeOperation = 'source-over'
}

/**
 * Animate the fog reveal for a newly added visit.
 * Circle grows from 0 to target radius with ease-out cubic easing.
 */
export function animateReveal(
  canvas: HTMLCanvasElement,
  visits: Visit[],
  newVisit: Visit,
  map: mapboxgl.Map,
  fogRadiusKm: number,
  onComplete?: () => void
): void {
  const duration = 800 // ms
  const startTime = performance.now()

  function animate(now: number) {
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const elapsed = now - startTime
    const progress = Math.min(elapsed / duration, 1)
    // Ease out cubic
    const eased = 1 - Math.pow(1 - progress, 3)

    // Redraw full fog + all previous visits
    drawFog(canvas, visits, map, fogRadiusKm)

    // Draw the new reveal on top with growing radius
    const targetRadius = kmToPixels(fogRadiusKm, newVisit.lat, map)
    const currentRadius = targetRadius * eased

    ctx.globalCompositeOperation = 'destination-out'
    const { x, y } = lngLatToPixel(newVisit.lng, newVisit.lat, map)
    const gradient = ctx.createRadialGradient(x, y, 0, x, y, currentRadius)
    gradient.addColorStop(0, 'rgba(0, 0, 0, 1)')
    gradient.addColorStop(0.7, 'rgba(0, 0, 0, 0.95)')
    gradient.addColorStop(1, 'rgba(0, 0, 0, 0)')
    ctx.fillStyle = gradient
    ctx.beginPath()
    ctx.arc(x, y, currentRadius, 0, Math.PI * 2)
    ctx.fill()
    ctx.globalCompositeOperation = 'source-over'

    if (progress < 1) {
      requestAnimationFrame(animate)
    } else {
      onComplete?.()
    }
  }

  requestAnimationFrame(animate)
}

/**
 * Calculate the exploration percentage using an offscreen canvas.
 * Renders visits onto an equirectangular projection and counts revealed pixels.
 */
export function calculateExplorationPct(
  visits: Visit[],
  fogRadiusKm: number
): number {
  if (visits.length === 0) return 0

  const W = 3600
  const H = 1800
  const offscreen = document.createElement('canvas')
  offscreen.width = W
  offscreen.height = H
  const ctx = offscreen.getContext('2d')!

  ctx.fillStyle = 'black'
  ctx.fillRect(0, 0, W, H)
  ctx.globalCompositeOperation = 'destination-out'

  visits.forEach(({ lat, lng }) => {
    const px = ((lng + 180) / 360) * W
    const py = ((90 - lat) / 180) * H
    // Convert km to equirectangular pixels (approximate)
    const latRad = (lat * Math.PI) / 180
    const kmPerDegLng = 111.32 * Math.cos(latRad)
    const pxPerKmLng = ((W / 360) * kmPerDegLng) / 111.32
    const radiusPx = fogRadiusKm * pxPerKmLng * 1.5

    ctx.beginPath()
    ctx.arc(px, py, radiusPx, 0, Math.PI * 2)
    ctx.fillStyle = 'rgba(0,0,0,1)'
    ctx.fill()
  })

  const imageData = ctx.getImageData(0, 0, W, H)
  let revealedPixels = 0
  for (let i = 3; i < imageData.data.length; i += 4) {
    if (imageData.data[i] === 0) revealedPixels++
  }

  return Math.min((revealedPixels / (W * H)) * 100, 100)
}
