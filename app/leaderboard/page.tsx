'use client'

import { useEffect, useState } from 'react'
import { Trophy, Compass, ArrowLeft } from 'lucide-react'
import { useSession } from 'next-auth/react'
import { Badge } from '@/components/ui/Badge'
import { Card } from '@/components/ui/Card'
import type { LeaderboardEntry } from '@/types'

const RANK_COLORS = ['var(--accent)', '#efaf27', '#cd7f5b']

export default function LeaderboardPage() {
  const { data: session } = useSession()
  const [entries, setEntries] = useState<LeaderboardEntry[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/leaderboard')
      .then((r) => r.json())
      .then(setEntries)
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'var(--fog-bg)',
        padding: 24,
        overflow: 'auto',
      }}
    >
      <div style={{ maxWidth: 700, margin: '0 auto' }}>
        {/* Header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: 24,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <a
              href="/map"
              style={{
                color: 'var(--text-secondary)',
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <ArrowLeft size={20} />
            </a>
            <Trophy size={24} color="var(--accent)" />
            <h1
              style={{
                fontSize: 'var(--text-xl)',
                fontWeight: 500,
                margin: 0,
              }}
            >
              Leaderboard
            </h1>
          </div>
          <a
            href="/"
            style={{
              color: 'var(--accent)',
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              textDecoration: 'none',
              fontWeight: 500,
              fontSize: 'var(--text-sm)',
            }}
          >
            <Compass size={16} />
            Fogtrail
          </a>
        </div>

        {/* Opt-in banner */}
        {session && (
          <Card style={{ marginBottom: 20, padding: '12px 16px' }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                fontSize: 'var(--text-sm)',
              }}
            >
              <span style={{ color: 'var(--text-secondary)' }}>
                Want to appear on the leaderboard?
              </span>
              <a
                href="/settings"
                style={{ color: 'var(--accent)', textDecoration: 'none' }}
              >
                Enable in Settings →
              </a>
            </div>
          </Card>
        )}

        {loading ? (
          <div
            style={{
              textAlign: 'center',
              padding: 48,
              color: 'var(--text-tertiary)',
            }}
          >
            Loading explorers...
          </div>
        ) : entries.length === 0 ? (
          <div
            style={{
              textAlign: 'center',
              padding: 48,
              color: 'var(--text-tertiary)',
            }}
          >
            <Trophy size={48} style={{ opacity: 0.2, marginBottom: 12 }} />
            <div>No explorers on the leaderboard yet</div>
          </div>
        ) : (
          <div
            style={{
              borderRadius: 12,
              overflow: 'hidden',
              border: '1px solid var(--border)',
            }}
          >
            {/* Table header */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '60px 1fr 120px 100px',
                padding: '10px 16px',
                background: 'var(--surface)',
                fontSize: 'var(--text-xs)',
                color: 'var(--text-tertiary)',
                fontWeight: 500,
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
              }}
            >
              <span>Rank</span>
              <span>Explorer</span>
              <span style={{ textAlign: 'right' }}>Explored</span>
              <span style={{ textAlign: 'right' }}>Countries</span>
            </div>

            {entries.map((entry) => (
              <a
                key={entry.rank}
                href={`/${entry.username}`}
                style={{
                  display: 'grid',
                  gridTemplateColumns: '60px 1fr 120px 100px',
                  padding: '12px 16px',
                  alignItems: 'center',
                  borderTop: '1px solid var(--border)',
                  textDecoration: 'none',
                  color: 'inherit',
                  transition: 'background 0.15s ease',
                  background:
                    entry.rank <= 3
                      ? `${RANK_COLORS[entry.rank - 1]}08`
                      : 'transparent',
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.background = 'var(--surface-hover)')
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.background =
                    entry.rank <= 3
                      ? `${RANK_COLORS[entry.rank - 1]}08`
                      : 'transparent')
                }
              >
                <span
                  style={{
                    fontWeight: 500,
                    color:
                      entry.rank <= 3
                        ? RANK_COLORS[entry.rank - 1]
                        : 'var(--text-tertiary)',
                    fontSize:
                      entry.rank <= 3 ? 'var(--text-lg)' : 'var(--text-base)',
                  }}
                >
                  #{entry.rank}
                </span>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  {entry.avatar && (
                    <img
                      src={entry.avatar}
                      alt=""
                      style={{
                        width: 28,
                        height: 28,
                        borderRadius: '50%',
                      }}
                    />
                  )}
                  <div>
                    <div style={{ fontWeight: 500, fontSize: 'var(--text-sm)' }}>
                      {entry.name}
                    </div>
                    <div
                      style={{
                        fontSize: 'var(--text-xs)',
                        color: 'var(--text-tertiary)',
                      }}
                    >
                      @{entry.username}
                    </div>
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <Badge
                    variant={entry.rank <= 3 ? 'accent' : 'secondary'}
                    size="md"
                  >
                    {entry.explorationPct.toFixed(1)}%
                  </Badge>
                </div>
                <div
                  style={{
                    textAlign: 'right',
                    fontSize: 'var(--text-sm)',
                    color: 'var(--text-secondary)',
                  }}
                >
                  {entry.countriesCount}
                </div>
              </a>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
