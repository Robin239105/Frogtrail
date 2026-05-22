'use client'

import { useState, useCallback } from 'react'
import Map, { NavigationControl } from 'react-map-gl/mapbox'
import { FogCanvas } from './FogCanvas'
import { MapControls } from './MapControls'
import type { Visit } from '@/types'
import 'mapbox-gl/dist/mapbox-gl.css'

interface FogMapProps {
  visits: Visit[]
  fogRadiusKm?: number
  interactive?: boolean
  showControls?: boolean
  initialViewState?: {
    longitude: number
    latitude: number
    zoom: number
  }
  onMapRef?: (map: mapboxgl.Map) => void
}

const DEFAULT_VIEW = {
  longitude: 20,
  latitude: 20,
  zoom: 1.8,
}

export function FogMap({
  visits,
  fogRadiusKm = 150,
  interactive = true,
  showControls = true,
  initialViewState = DEFAULT_VIEW,
  onMapRef,
}: FogMapProps) {
  const [projection, setProjection] = useState<'globe' | 'mercator'>('globe')

  const handleLoad = useCallback(
    (e: mapboxgl.MapboxEvent) => {
      onMapRef?.(e.target)
    },
    [onMapRef]
  )

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      <Map
        id="fogmap"
        mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_TOKEN}
        initialViewState={initialViewState}
        style={{ width: '100%', height: '100%' }}
        mapStyle="mapbox://styles/mapbox/dark-v11"
        interactive={interactive}
        projection={{ name: projection }}
        fog={{
          color: 'rgb(14, 18, 28)',
          'horizon-blend': 0.02,
        }}
        attributionControl={false}
        onLoad={handleLoad}
      >
        {interactive && <NavigationControl position="bottom-right" />}
        <FogCanvas visits={visits} fogRadiusKm={fogRadiusKm} />
      </Map>
      {showControls && interactive && (
        <MapControls
          projection={projection}
          onProjectionChange={setProjection}
        />
      )}
    </div>
  )
}
