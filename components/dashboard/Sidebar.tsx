'use client'

import { useState } from 'react'
import { Plus, Settings, LogOut, ChevronLeft, ChevronRight, Search } from 'lucide-react'
import { signOut } from 'next-auth/react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { StatsPanel } from './StatsPanel'
import { VisitList } from './VisitList'
import type { Visit, UserStats } from '@/types'

interface SidebarProps {
  user: {
    name?: string | null
    image?: string | null
    username?: string
  }
  visits: Visit[]
  stats: UserStats
  onAddVisit: () => void
  onVisitClick: (visit: Visit) => void
  onDeleteVisit: (id: string) => void
}

export function Sidebar({
  user,
  visits,
  stats,
  onAddVisit,
  onVisitClick,
  onDeleteVisit,
}: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false)
  const [filter, setFilter] = useState('')

  const filteredVisits = filter
    ? visits.filter(
        (v) =>
          v.cityName.toLowerCase().includes(filter.toLowerCase()) ||
          v.country.toLowerCase().includes(filter.toLowerCase())
      )
    : visits

  if (collapsed) {
    return (
      <div
        className="glass"
        style={{
          position: 'absolute',
          top: 16,
          left: 16,
          zIndex: 30,
          borderRadius: 12,
          padding: 8,
        }}
      >
        <button
          onClick={() => setCollapsed(false)}
          style={{
            background: 'none',
            border: 'none',
            color: 'var(--text-secondary)',
            cursor: 'pointer',
            padding: 8,
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <ChevronRight size={18} />
        </button>
      </div>
    )
  }

  return (
    <div
      className="glass"
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        bottom: 0,
        width: 320,
        zIndex: 30,
        display: 'flex',
        flexDirection: 'column',
        borderRight: '1px solid var(--border)',
        borderRadius: 0,
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: '16px 16px 0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          {user.image && (
            <img
              src={user.image}
              alt=""
              style={{
                width: 36,
                height: 36,
                borderRadius: '50%',
                border: '2px solid var(--accent)',
              }}
            />
          )}
          <div>
            <div style={{ fontWeight: 500, fontSize: 'var(--text-sm)' }}>
              {user.name ?? 'Explorer'}
            </div>
            {user.username && (
              <div
                style={{
                  fontSize: 'var(--text-xs)',
                  color: 'var(--text-tertiary)',
                }}
              >
                @{user.username}
              </div>
            )}
          </div>
        </div>
        <button
          onClick={() => setCollapsed(true)}
          style={{
            background: 'none',
            border: 'none',
            color: 'var(--text-tertiary)',
            cursor: 'pointer',
            padding: 4,
          }}
        >
          <ChevronLeft size={18} />
        </button>
      </div>

      {/* Stats */}
      <div style={{ padding: '16px' }}>
        <StatsPanel stats={stats} />
      </div>

      {/* Add visit button */}
      <div style={{ padding: '0 16px 12px' }}>
        <Button fullWidth onClick={onAddVisit}>
          <Plus size={16} />
          Add a visit
        </Button>
      </div>

      {/* Filter */}
      <div style={{ padding: '0 16px 8px' }}>
        <Input
          placeholder="Filter visits..."
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          icon={<Search size={14} />}
          style={{ fontSize: 'var(--text-sm)', padding: '7px 10px', paddingLeft: 34 }}
        />
      </div>

      {/* Visit list */}
      <div
        style={{
          flex: 1,
          overflowY: 'auto',
          padding: '0 8px',
        }}
      >
        <VisitList
          visits={filteredVisits}
          onVisitClick={onVisitClick}
          onDeleteVisit={onDeleteVisit}
        />
      </div>

      {/* Footer */}
      <div
        style={{
          padding: '12px 16px',
          borderTop: '1px solid var(--border)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <a
          href="/settings"
          style={{
            color: 'var(--text-tertiary)',
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            fontSize: 'var(--text-sm)',
            textDecoration: 'none',
            transition: 'color 0.15s ease',
          }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.color = 'var(--text-secondary)')
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.color = 'var(--text-tertiary)')
          }
        >
          <Settings size={14} />
          Settings
        </a>
        <button
          onClick={() => signOut({ callbackUrl: '/' })}
          style={{
            background: 'none',
            border: 'none',
            color: 'var(--text-tertiary)',
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            fontSize: 'var(--text-sm)',
            cursor: 'pointer',
            fontFamily: 'inherit',
            transition: 'color 0.15s ease',
          }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.color = 'var(--text-secondary)')
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.color = 'var(--text-tertiary)')
          }
        >
          <LogOut size={14} />
          Sign out
        </button>
      </div>
    </div>
  )
}
