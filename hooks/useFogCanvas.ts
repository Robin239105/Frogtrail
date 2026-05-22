'use client'

import { useRef, useCallback } from 'react'
import { animateReveal } from '@/lib/fog'
import type { Visit } from '@/types'

export function useFogCanvas(fogRadiusKm: number = 150) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const mapRef = useRef<mapboxgl.Map | null>(null)

  const setCanvas = useCallback((canvas: HTMLCanvasElement | null) => {
    canvasRef.current = canvas
  }, [])

  const setMap = useCallback((map: mapboxgl.Map | null) => {
    mapRef.current = map
  }, [])

  const triggerReveal = useCallback(
    (existingVisits: Visit[], newVisit: Visit, onComplete?: () => void) => {
      const canvas = canvasRef.current
      const map = mapRef.current
      if (!canvas || !map) return

      // Fly to the new location first
      map.flyTo({
        center: [newVisit.lng, newVisit.lat],
        zoom: 5,
        duration: 800,
      })

      // Start reveal animation after fly completes
      setTimeout(() => {
        animateReveal(canvas, existingVisits, newVisit, map, fogRadiusKm, onComplete)
      }, 800)
    },
    [fogRadiusKm]
  )

  return {
    canvasRef,
    mapRef,
    setCanvas,
    setMap,
    triggerReveal,
  }
}
