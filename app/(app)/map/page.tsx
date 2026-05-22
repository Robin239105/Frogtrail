'use client'

import { useState, useCallback, useRef } from 'react'
import { useSession } from 'next-auth/react'
import { FogMap } from '@/components/map/FogMap'
import { Sidebar } from '@/components/dashboard/Sidebar'
import { AddVisitModal } from '@/components/dashboard/AddVisitModal'
import { useVisits } from '@/hooks/useVisits'
import { useStats } from '@/hooks/useStats'
import { animateReveal } from '@/lib/fog'
import type { Visit } from '@/types'

export default function MapDashboard() {
  const { data: session } = useSession()
  const { visits, addVisit, deleteVisit } = useVisits()
  const stats = useStats(visits)
  const [showAddModal, setShowAddModal] = useState(false)
  const [toast, setToast] = useState<string | null>(null)
  const mapInstanceRef = useRef<mapboxgl.Map | null>(null)
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  const handleMapRef = useCallback((map: mapboxgl.Map) => {
    mapInstanceRef.current = map
    // Find the fog canvas
    const container = map.getContainer()
    const canvas = container.querySelector('canvas[style*="pointer-events: none"]') as HTMLCanvasElement
    if (canvas) canvasRef.current = canvas
  }, [])

  const handleAddVisit = useCallback(
    async (data: {
      lat: number
      lng: number
      cityName: string
      country: string
      countryCode: string
      continent: string
      visitedAt: string
      note?: string
    }) => {
      const newVisit = await addVisit(data)
      if (!newVisit || !mapInstanceRef.current) return

      // Fly to the new location
      mapInstanceRef.current.flyTo({
        center: [data.lng, data.lat],
        zoom: 5,
        duration: 800,
      })

      // Animate reveal after fly
      setTimeout(() => {
        if (canvasRef.current && mapInstanceRef.current) {
          animateReveal(
            canvasRef.current,
            visits,
            newVisit,
            mapInstanceRef.current,
            150,
            () => {
              // Show toast
              setToast(`✓ ${data.cityName} revealed!`)
              setTimeout(() => setToast(null), 2500)
            }
          )
        }
      }, 850)
    },
    [addVisit, visits]
  )

  const handleVisitClick = useCallback(
    (visit: Visit) => {
      if (!mapInstanceRef.current) return
      mapInstanceRef.current.flyTo({
        center: [visit.lng, visit.lat],
        zoom: 5,
        duration: 800,
      })
    },
    []
  )

  const handleDeleteVisit = useCallback(
    async (id: string) => {
      await deleteVisit(id)
    },
    [deleteVisit]
  )

  return (
    <div style={{ width: '100vw', height: '100vh', position: 'relative' }}>
      <FogMap
        visits={visits}
        fogRadiusKm={150}
        onMapRef={handleMapRef}
      />

      <Sidebar
        user={{
          name: session?.user?.name,
          image: session?.user?.image,
          username: session?.user?.username,
        }}
        visits={visits}
        stats={stats}
        onAddVisit={() => setShowAddModal(true)}
        onVisitClick={handleVisitClick}
        onDeleteVisit={handleDeleteVisit}
      />

      <AddVisitModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSubmit={handleAddVisit}
      />

      {/* Toast notification */}
      {toast && (
        <div
          className="toast glass"
          style={{
            color: 'var(--accent)',
            background: 'rgba(17, 24, 39, 0.95)',
          }}
        >
          {toast}
        </div>
      )}
    </div>
  )
}
