'use client'

import { useState } from 'react'
import { MapPin, Trash2 } from 'lucide-react'
import { format } from 'date-fns'
import type { Visit } from '@/types'

// Simple country code to flag emoji
function countryFlag(code: string): string {
  if (!code || code.length !== 2) return '🌍'
  return String.fromCodePoint(
    ...code
      .toUpperCase()
      .split('')
      .map((c) => 0x1f1e6 + c.charCodeAt(0) - 65)
  )
}

interface VisitListProps {
  visits: Visit[]
  onVisitClick: (visit: Visit) => void
  onDeleteVisit: (id: string) => void
}

export function VisitList({ visits, onVisitClick, onDeleteVisit }: VisitListProps) {
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null)

  if (visits.length === 0) {
    return (
      <div
        style={{
          textAlign: 'center',
          padding: '32px 16px',
          color: 'var(--text-tertiary)',
          fontSize: 'var(--text-sm)',
        }}
      >
        <MapPin
          size={32}
          style={{ margin: '0 auto 12px', opacity: 0.3 }}
        />
        <div>No visits yet</div>
        <div style={{ marginTop: 4 }}>Add your first city to start unfogging!</div>
      </div>
    )
  }

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
      }}
    >
      {visits.map((visit) => (
        <div
          key={visit.id}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '10px 12px',
            borderRadius: 8,
            cursor: 'pointer',
            transition: 'background 0.15s ease',
          }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.background = 'rgba(255,255,255,0.04)')
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.background = 'transparent')
          }
          onClick={() => onVisitClick(visit)}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 0 }}>
            <span style={{ fontSize: 18 }}>{countryFlag(visit.countryCode)}</span>
            <div style={{ minWidth: 0 }}>
              <div
                style={{
                  fontWeight: 500,
                  fontSize: 'var(--text-sm)',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
              >
                {visit.cityName}
              </div>
              <div
                style={{
                  fontSize: 'var(--text-xs)',
                  color: 'var(--text-tertiary)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 4,
                  marginTop: 1,
                }}
              >
                {visit.country} ·{' '}
                {format(new Date(visit.visitedAt), 'MMM yyyy')}
              </div>
            </div>
          </div>

          {/* Delete button / confirmation */}
          <div
            onClick={(e) => e.stopPropagation()}
            style={{ flexShrink: 0, marginLeft: 8 }}
          >
            {confirmDelete === visit.id ? (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  fontSize: 'var(--text-xs)',
                }}
              >
                <button
                  onClick={() => {
                    onDeleteVisit(visit.id)
                    setConfirmDelete(null)
                  }}
                  style={{
                    background: 'var(--danger)',
                    color: '#fff',
                    border: 'none',
                    borderRadius: 4,
                    padding: '4px 8px',
                    cursor: 'pointer',
                    fontFamily: 'inherit',
                    fontSize: 'var(--text-xs)',
                  }}
                >
                  Remove
                </button>
                <button
                  onClick={() => setConfirmDelete(null)}
                  style={{
                    background: 'none',
                    color: 'var(--text-tertiary)',
                    border: 'none',
                    cursor: 'pointer',
                    fontFamily: 'inherit',
                    fontSize: 'var(--text-xs)',
                  }}
                >
                  Cancel
                </button>
              </div>
            ) : (
              <button
                onClick={() => setConfirmDelete(visit.id)}
                className="visit-delete-btn"
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--text-tertiary)',
                  cursor: 'pointer',
                  padding: 4,
                  borderRadius: 4,
                  opacity: 0,
                  transition: 'opacity 0.15s ease',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.opacity = '1')}
                onMouseLeave={(e) => (e.currentTarget.style.opacity = '0')}
              >
                <Trash2 size={14} />
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}
