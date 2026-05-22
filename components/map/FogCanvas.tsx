'use client'

import { useEffect, useRef, useCallback } from 'react'
import { useMap } from 'react-map-gl/mapbox'
import { drawFog } from '@/lib/fog'
import type { Visit } from '@/types'

interface FogCanvasProps {
  visits: Visit[]
  fogRadiusKm: number
  opacity?: number
}

export function FogCanvas({ visits, fogRadiusKm, opacity = 0.92 }: FogCanvasProps) {
  const { current: map } = useMap()
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const render = useCallback(() => {
    if (!map || !canvasRef.current) return
    drawFog(canvasRef.current, visits, map.getMap(), fogRadiusKm, opacity)
  }, [map, visits, fogRadiusKm, opacity])

  useEffect(() => {
    if (!map) return

    // Initial render after map loads
    const mapInstance = map.getMap()

    const onLoad = () => render()
    if (mapInstance.loaded()) {
      render()
    } else {
      mapInstance.on('load', onLoad)
    }

    // Re-render on every map interaction
    mapInstance.on('move', render)
    mapInstance.on('zoom', render)
    mapInstance.on('rotate', render)
    mapInstance.on('pitch', render)
    mapInstance.on('resize', render)

    return () => {
      mapInstance.off('load', onLoad)
      mapInstance.off('move', render)
      mapInstance.off('zoom', render)
      mapInstance.off('rotate', render)
      mapInstance.off('pitch', render)
      mapInstance.off('resize', render)
    }
  }, [map, render])

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 10,
      }}
    />
  )
}
