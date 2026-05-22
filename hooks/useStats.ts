'use client'

import { useState, useEffect } from 'react'
import { calculateStats } from '@/lib/stats'
import { calculateExplorationPct } from '@/lib/fog'
import type { Visit, UserStats } from '@/types'

export function useStats(visits: Visit[], fogRadiusKm: number = 150) {
  const [stats, setStats] = useState<UserStats>(() =>
    calculateStats(visits)
  )

  useEffect(() => {
    const baseStats = calculateStats(visits)

    // Calculate exploration % client-side (requires canvas)
    if (typeof window !== 'undefined' && visits.length > 0) {
      try {
        const pct = calculateExplorationPct(visits, fogRadiusKm)
        setStats({ ...baseStats, explorationPct: Math.round(pct * 100) / 100 })
      } catch {
        setStats(baseStats)
      }
    } else {
      setStats(baseStats)
    }
  }, [visits, fogRadiusKm])

  return stats
}
