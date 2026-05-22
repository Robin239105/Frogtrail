'use client'

import { Marker } from 'react-map-gl/mapbox'
import { MapPin } from 'lucide-react'
import type { Visit } from '@/types'

interface VisitMarkerProps {
  visit: Visit
  isActive?: boolean
  onClick?: () => void
}

export function VisitMarker({ visit, isActive = false, onClick }: VisitMarkerProps) {
  return (
    <Marker
      longitude={visit.lng}
      latitude={visit.lat}
      anchor="bottom"
      onClick={(e) => {
        e.originalEvent.stopPropagation()
        onClick?.()
      }}
    >
      <div
        style={{
          cursor: 'pointer',
          transition: 'transform 0.2s ease',
          transform: isActive ? 'scale(1.3)' : 'scale(1)',
          filter: isActive
            ? 'drop-shadow(0 0 8px rgba(29, 158, 117, 0.6))'
            : 'none',
        }}
      >
        <MapPin
          size={24}
          color={isActive ? '#1D9E75' : '#8b9ab0'}
          fill={isActive ? 'rgba(29, 158, 117, 0.3)' : 'transparent'}
        />
      </div>
    </Marker>
  )
}
