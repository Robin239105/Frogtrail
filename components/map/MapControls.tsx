'use client'

import { Globe, Map as MapIcon } from 'lucide-react'

interface MapControlsProps {
  projection: 'globe' | 'mercator'
  onProjectionChange: (projection: 'globe' | 'mercator') => void
}

export function MapControls({ projection, onProjectionChange }: MapControlsProps) {
  return (
    <div
      style={{
        position: 'absolute',
        top: 16,
        right: 16,
        zIndex: 20,
        display: 'flex',
        flexDirection: 'column',
        gap: 8,
      }}
    >
      <button
        onClick={() =>
          onProjectionChange(projection === 'globe' ? 'mercator' : 'globe')
        }
        className="glass glass-hover"
        style={{
          width: 40,
          height: 40,
          borderRadius: 8,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          color: 'var(--text-secondary)',
          transition: 'all 0.2s ease',
        }}
        title={projection === 'globe' ? 'Switch to flat map' : 'Switch to globe'}
      >
        {projection === 'globe' ? (
          <MapIcon size={18} />
        ) : (
          <Globe size={18} />
        )}
      </button>
    </div>
  )
}
