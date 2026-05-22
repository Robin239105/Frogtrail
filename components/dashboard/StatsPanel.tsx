'use client'

import { useEffect, useState, useRef } from 'react'
import type { UserStats } from '@/types'

interface StatsPanelProps {
  stats: UserStats
}

function AnimatedNumber({ value, decimals = 0 }: { value: number; decimals?: number }) {
  const [display, setDisplay] = useState(0)
  const animatedRef = useRef(false)

  useEffect(() => {
    if (animatedRef.current && value === display) return
    animatedRef.current = true

    const duration = 800
    const startTime = performance.now()
    const startValue = display

    function animate(now: number) {
      const elapsed = now - startTime
      const progress = Math.min(elapsed / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      const current = startValue + (value - startValue) * eased
      setDisplay(current)
      if (progress < 1) requestAnimationFrame(animate)
    }

    requestAnimationFrame(animate)
  }, [value])

  return (
    <span className="stat-number">
      {decimals > 0 ? display.toFixed(decimals) : Math.round(display)}
    </span>
  )
}

function ProgressRing({ percentage }: { percentage: number }) {
  const radius = 32
  const stroke = 3
  const normalizedRadius = radius - stroke
  const circumference = normalizedRadius * 2 * Math.PI
  const strokeDashoffset = circumference - (percentage / 100) * circumference

  return (
    <div style={{ position: 'relative', width: radius * 2, height: radius * 2 }}>
      <svg width={radius * 2} height={radius * 2}>
        {/* Background ring */}
        <circle
          stroke="rgba(255,255,255,0.06)"
          fill="transparent"
          strokeWidth={stroke}
          r={normalizedRadius}
          cx={radius}
          cy={radius}
        />
        {/* Progress ring */}
        <circle
          stroke="var(--accent)"
          fill="transparent"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={`${circumference} ${circumference}`}
          strokeDashoffset={strokeDashoffset}
          className="progress-ring-circle"
          r={normalizedRadius}
          cx={radius}
          cy={radius}
        />
      </svg>
      <div
        style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column',
        }}
      >
        <span
          style={{
            fontSize: 'var(--text-sm)',
            fontWeight: 500,
            color: 'var(--accent)',
          }}
        >
          <AnimatedNumber value={percentage} decimals={1} />%
        </span>
      </div>
    </div>
  )
}

export function StatsPanel({ stats }: StatsPanelProps) {
  const statItems = [
    { label: 'Countries', value: stats.countriesCount },
    { label: 'Cities', value: stats.citiesCount },
    { label: 'Continents', value: stats.continentsCount },
  ]

  return (
    <div>
      {/* Exploration progress */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 14,
          marginBottom: 16,
        }}
      >
        <ProgressRing percentage={stats.explorationPct} />
        <div>
          <div
            style={{
              fontSize: 'var(--text-sm)',
              color: 'var(--text-secondary)',
            }}
          >
            Explored
          </div>
          <div
            style={{
              fontSize: 'var(--text-xl)',
              fontWeight: 500,
              color: 'var(--accent)',
            }}
          >
            <AnimatedNumber value={stats.explorationPct} decimals={2} />%
          </div>
        </div>
      </div>

      {/* Stat columns */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: 8,
        }}
      >
        {statItems.map(({ label, value }) => (
          <div
            key={label}
            style={{
              textAlign: 'center',
              padding: '10px 0',
              borderRadius: 8,
              background: 'rgba(255,255,255,0.03)',
            }}
          >
            <div
              style={{
                fontSize: 'var(--text-xl)',
                fontWeight: 500,
                color: 'var(--text-primary)',
              }}
            >
              <AnimatedNumber value={value} />
            </div>
            <div
              style={{
                fontSize: 'var(--text-xs)',
                color: 'var(--text-tertiary)',
                marginTop: 2,
              }}
            >
              {label}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
