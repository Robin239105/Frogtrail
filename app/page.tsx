'use client'

import { useEffect, useState, useRef } from 'react'
import { Compass, MapPin, Share2, BarChart3, ArrowRight } from 'lucide-react'
import { FogMap } from '@/components/map/FogMap'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import type { Visit } from '@/types'

// Cities that auto-reveal in the demo
const DEMO_CITIES: Visit[] = [
  { id: '1', userId: 'demo', lat: 48.8566, lng: 2.3522, cityName: 'Paris', country: 'France', countryCode: 'FR', continent: 'Europe', visitedAt: '2024-01-01', createdAt: '2024-01-01' },
  { id: '2', userId: 'demo', lat: 35.6762, lng: 139.6503, cityName: 'Tokyo', country: 'Japan', countryCode: 'JP', continent: 'Asia', visitedAt: '2024-02-01', createdAt: '2024-02-01' },
  { id: '3', userId: 'demo', lat: 40.7128, lng: -74.006, cityName: 'New York', country: 'United States', countryCode: 'US', continent: 'North America', visitedAt: '2024-03-01', createdAt: '2024-03-01' },
  { id: '4', userId: 'demo', lat: -33.8688, lng: 151.2093, cityName: 'Sydney', country: 'Australia', countryCode: 'AU', continent: 'Oceania', visitedAt: '2024-04-01', createdAt: '2024-04-01' },
  { id: '5', userId: 'demo', lat: 30.0444, lng: 31.2357, cityName: 'Cairo', country: 'Egypt', countryCode: 'EG', continent: 'Africa', visitedAt: '2024-05-01', createdAt: '2024-05-01' },
]

function AnimatedCounter({ target, suffix = '' }: { target: number; suffix?: string }) {
  const [value, setValue] = useState(0)
  const ref = useRef<HTMLDivElement>(null)
  const started = useRef(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true
          const duration = 1200
          const start = performance.now()
          const animate = (now: number) => {
            const elapsed = now - start
            const progress = Math.min(elapsed / duration, 1)
            const eased = 1 - Math.pow(1 - progress, 3)
            setValue(Math.round(target * eased))
            if (progress < 1) requestAnimationFrame(animate)
          }
          requestAnimationFrame(animate)
        }
      },
      { threshold: 0.5 }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [target])

  return (
    <span ref={ref} className="stat-number">
      {value.toLocaleString()}{suffix}
    </span>
  )
}

export default function LandingPage() {
  const [demoVisits, setDemoVisits] = useState<Visit[]>([])

  // Auto-reveal cities one by one
  useEffect(() => {
    DEMO_CITIES.forEach((city, i) => {
      setTimeout(() => {
        setDemoVisits((prev) => [...prev, city])
      }, 1200 + i * 1200)
    })
  }, [])

  return (
    <div style={{ background: 'var(--fog-bg)', overflow: 'auto', height: '100vh' }}>
      {/* Hero — full viewport */}
      <section style={{ position: 'relative', height: '100vh', width: '100%' }}>
        {/* Background map */}
        <div style={{ position: 'absolute', inset: 0 }}>
          <FogMap
            visits={demoVisits}
            fogRadiusKm={150}
            interactive={false}
            showControls={false}
            initialViewState={{ longitude: 20, latitude: 20, zoom: 1.5 }}
          />
        </div>

        {/* Floating logo */}
        <div
          style={{
            position: 'absolute',
            top: 24,
            left: 24,
            zIndex: 20,
            display: 'flex',
            alignItems: 'center',
            gap: 8,
          }}
        >
          <Compass size={24} color="var(--accent)" />
          <span
            style={{
              fontSize: 'var(--text-lg)',
              fontWeight: 500,
              color: 'var(--text-primary)',
              letterSpacing: '-0.02em',
            }}
          >
            Fogtrail
          </span>
        </div>

        {/* Center overlay */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            zIndex: 15,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            padding: 24,
            pointerEvents: 'none',
          }}
        >
          <h1
            className="animate-fade-in"
            style={{
              fontSize: 'clamp(32px, 7vw, var(--text-hero))',
              fontWeight: 500,
              margin: '0 0 12px',
              lineHeight: 1.1,
              letterSpacing: '-0.03em',
              maxWidth: 600,
            }}
          >
            Your world.{' '}
            <span style={{ color: 'var(--accent)' }}>Unfogged.</span>
          </h1>
          <p
            className="animate-slide-up"
            style={{
              fontSize: 'clamp(14px, 2vw, var(--text-lg))',
              color: 'var(--text-secondary)',
              margin: '0 0 32px',
              maxWidth: 440,
              lineHeight: 1.5,
            }}
          >
            Log where you&apos;ve been. Watch the world reveal itself.
          </p>
          <div style={{ pointerEvents: 'auto' }}>
            <a href="/login">
              <Button size="lg" style={{ fontSize: 'var(--text-base)', gap: 8 }}>
                Start mapping
                <ArrowRight size={18} />
              </Button>
            </a>
          </div>
        </div>

        {/* Bottom bar */}
        <div
          className="glass"
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            zIndex: 20,
            padding: '12px 24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
            fontSize: 'var(--text-sm)',
            color: 'var(--text-secondary)',
            borderRadius: 0,
          }}
        >
          Mapped by{' '}
          <span style={{ color: 'var(--accent)', fontWeight: 500 }}>
            <AnimatedCounter target={12847} />
          </span>{' '}
          explorers,{' '}
          <span style={{ color: 'var(--accent)', fontWeight: 500 }}>
            <AnimatedCounter target={2} suffix="." />
            <AnimatedCounter target={3} suffix="%" />
          </span>{' '}
          of Earth revealed
        </div>
      </section>

      {/* Features section */}
      <section
        style={{
          padding: '80px 24px',
          maxWidth: 1000,
          margin: '0 auto',
        }}
      >
        <h2
          style={{
            textAlign: 'center',
            fontSize: 'var(--text-2xl)',
            fontWeight: 500,
            marginBottom: 48,
          }}
        >
          How it works
        </h2>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: 20,
          }}
        >
          {[
            {
              icon: <MapPin size={24} color="var(--accent)" />,
              title: 'Fog of war map',
              desc: 'The world starts completely dark. Every place you visit lifts the fog, revealing the map beneath.',
            },
            {
              icon: <Share2 size={24} color="var(--accent)" />,
              title: 'Shareable profile',
              desc: 'Get a public profile with your fog map. Share your exploration journey with friends and fellow travelers.',
            },
            {
              icon: <BarChart3 size={24} color="var(--accent)" />,
              title: 'Exploration stats',
              desc: 'Track countries, cities, continents, and your overall Earth exploration percentage.',
            },
          ].map(({ icon, title, desc }) => (
            <Card key={title} hoverable style={{ padding: 28 }}>
              <div style={{ marginBottom: 14 }}>{icon}</div>
              <h3
                style={{
                  fontSize: 'var(--text-lg)',
                  fontWeight: 500,
                  margin: '0 0 8px',
                }}
              >
                {title}
              </h3>
              <p
                style={{
                  fontSize: 'var(--text-sm)',
                  color: 'var(--text-secondary)',
                  margin: 0,
                  lineHeight: 1.6,
                }}
              >
                {desc}
              </p>
            </Card>
          ))}
        </div>
      </section>

      {/* Second CTA */}
      <section
        style={{
          padding: '60px 24px 80px',
          textAlign: 'center',
        }}
      >
        <h2
          style={{
            fontSize: 'var(--text-2xl)',
            fontWeight: 500,
            marginBottom: 12,
          }}
        >
          Ready to unfog your world?
        </h2>
        <p
          style={{
            color: 'var(--text-secondary)',
            marginBottom: 32,
            fontSize: 'var(--text-base)',
          }}
        >
          Join thousands of explorers tracking their journeys
        </p>
        <a href="/login">
          <Button size="lg" style={{ fontSize: 'var(--text-base)', gap: 8 }}>
            Start mapping
            <ArrowRight size={18} />
          </Button>
        </a>
      </section>

      {/* Footer */}
      <footer
        style={{
          padding: '24px',
          borderTop: '1px solid var(--border)',
          textAlign: 'center',
          fontSize: 'var(--text-xs)',
          color: 'var(--text-tertiary)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
          <Compass size={14} color="var(--accent)" />
          <span>Fogtrail</span>
          <span>·</span>
          <a href="/leaderboard" style={{ color: 'inherit', textDecoration: 'none' }}>Leaderboard</a>
        </div>
      </footer>
    </div>
  )
}
