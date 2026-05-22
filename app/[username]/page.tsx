'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { Lock, Share2, Compass } from 'lucide-react'
import { FogMap } from '@/components/map/FogMap'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { StatsPanel } from '@/components/dashboard/StatsPanel'
import type { PublicProfile } from '@/types'

export default function ProfilePage() {
  const params = useParams()
  const username = (params.username as string)?.replace('%40', '')
  const [profile, setProfile] = useState<PublicProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (!username) return
    fetch(`/api/profile/${username}`)
      .then((r) => r.json())
      .then(setProfile)
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [username])

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  if (loading) {
    return (
      <div
        style={{
          minHeight: '100vh',
          background: 'var(--fog-bg)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'var(--text-tertiary)',
        }}
      >
        Loading...
      </div>
    )
  }

  if (!profile) {
    return (
      <div
        style={{
          minHeight: '100vh',
          background: 'var(--fog-bg)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column',
          gap: 12,
          color: 'var(--text-tertiary)',
        }}
      >
        <Compass size={48} style={{ opacity: 0.3 }} />
        <div style={{ fontSize: 'var(--text-lg)' }}>Explorer not found</div>
      </div>
    )
  }

  if (!profile.isPublic) {
    return (
      <div
        style={{
          minHeight: '100vh',
          background: 'var(--fog-bg)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column',
          gap: 16,
        }}
      >
        {profile.avatar && (
          <img
            src={profile.avatar}
            alt=""
            style={{
              width: 64,
              height: 64,
              borderRadius: '50%',
              border: '2px solid var(--border)',
            }}
          />
        )}
        <div style={{ fontWeight: 500, fontSize: 'var(--text-lg)' }}>
          {profile.name}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--text-tertiary)' }}>
          <Lock size={16} />
          This map is private
        </div>
      </div>
    )
  }

  // Group visits by continent
  const byContinent: Record<string, typeof profile.visits> = {}
  profile.visits.forEach((v) => {
    if (!byContinent[v.continent]) byContinent[v.continent] = []
    byContinent[v.continent].push(v)
  })

  return (
    <div style={{ minHeight: '100vh', background: 'var(--fog-bg)' }}>
      {/* Profile header */}
      <div
        className="glass"
        style={{
          padding: '16px 24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: '1px solid var(--border)',
          position: 'relative',
          zIndex: 20,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <a
            href="/"
            style={{
              color: 'var(--accent)',
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              textDecoration: 'none',
              fontWeight: 500,
            }}
          >
            <Compass size={20} />
            Fogtrail
          </a>
          <span style={{ color: 'var(--border)' }}>|</span>
          {profile.avatar && (
            <img
              src={profile.avatar}
              alt=""
              style={{ width: 28, height: 28, borderRadius: '50%' }}
            />
          )}
          <span style={{ fontWeight: 500 }}>{profile.name}</span>
          <span style={{ color: 'var(--text-tertiary)', fontSize: 'var(--text-sm)' }}>
            @{profile.username}
          </span>
          <Badge variant="accent">
            {profile.stats.explorationPct.toFixed(1)}% explored
          </Badge>
        </div>
        <Button variant="secondary" size="sm" onClick={handleShare}>
          <Share2 size={14} />
          {copied ? 'Copied!' : 'Share'}
        </Button>
      </div>

      {/* Map */}
      <div style={{ height: '60vh', width: '100%' }}>
        <FogMap
          visits={profile.visits}
          fogRadiusKm={150}
          interactive={true}
          showControls={false}
        />
      </div>

      {/* Stats + countries */}
      <div style={{ maxWidth: 800, margin: '0 auto', padding: 24 }}>
        <StatsPanel stats={profile.stats} />

        <div style={{ marginTop: 32 }}>
          <h2
            style={{
              fontSize: 'var(--text-lg)',
              fontWeight: 500,
              marginBottom: 16,
            }}
          >
            Visited countries
          </h2>
          {Object.entries(byContinent)
            .sort(([a], [b]) => a.localeCompare(b))
            .map(([continent, cVisits]) => {
              const countries = Array.from(new Set(cVisits.map((v) => v.country)))
              return (
                <div key={continent} style={{ marginBottom: 16 }}>
                  <div
                    style={{
                      fontSize: 'var(--text-sm)',
                      color: 'var(--text-tertiary)',
                      marginBottom: 6,
                      fontWeight: 500,
                    }}
                  >
                    {continent}
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                    {countries.map((c) => (
                      <Badge key={c} variant="secondary" size="md">
                        {c}
                      </Badge>
                    ))}
                  </div>
                </div>
              )
            })}
        </div>
      </div>
    </div>
  )
}
