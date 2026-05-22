'use client'

import { useState, useEffect, useRef } from 'react'
import { Search, MapPin, Calendar, X, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { debouncedSearch } from '@/lib/geocode'
import type { GeocodeResult } from '@/types'

interface AddVisitModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: {
    lat: number
    lng: number
    cityName: string
    country: string
    countryCode: string
    continent: string
    visitedAt: string
    note?: string
  }) => void
}

export function AddVisitModal({ isOpen, onClose, onSubmit }: AddVisitModalProps) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<GeocodeResult[]>([])
  const [selected, setSelected] = useState<GeocodeResult | null>(null)
  const [date, setDate] = useState(new Date().toISOString().split('T')[0])
  const [note, setNote] = useState('')
  const [isSearching, setIsSearching] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (isOpen) {
      setQuery('')
      setResults([])
      setSelected(null)
      setDate(new Date().toISOString().split('T')[0])
      setNote('')
      setTimeout(() => inputRef.current?.focus(), 100)
    }
  }, [isOpen])

  useEffect(() => {
    if (query.length < 2) {
      setResults([])
      return
    }
    setIsSearching(true)
    debouncedSearch(query, (res) => {
      setResults(res)
      setIsSearching(false)
    })
  }, [query])

  const handleSubmit = () => {
    if (!selected) return
    onSubmit({
      lat: selected.lat,
      lng: selected.lng,
      cityName: selected.cityName,
      country: selected.country,
      countryCode: selected.countryCode,
      continent: selected.continent,
      visitedAt: date,
      note: note || undefined,
    })
    onClose()
  }

  if (!isOpen) return null

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 50,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'rgba(0, 0, 0, 0.6)',
        backdropFilter: 'blur(4px)',
      }}
      onClick={onClose}
    >
      <div
        className="glass animate-slide-up"
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '100%',
          maxWidth: 440,
          borderRadius: 16,
          padding: 24,
          margin: 16,
          maxHeight: '85vh',
          overflowY: 'auto',
        }}
      >
        {/* Header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: 20,
          }}
        >
          <h2 style={{ fontSize: 'var(--text-lg)', fontWeight: 500, margin: 0 }}>
            Add a visit
          </h2>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--text-tertiary)',
              cursor: 'pointer',
              padding: 4,
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Search */}
        {!selected ? (
          <div>
            <Input
              ref={inputRef}
              placeholder="Search for a city..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              icon={<Search size={16} />}
            />
            {results.length > 0 && (
              <div
                style={{
                  marginTop: 8,
                  borderRadius: 8,
                  overflow: 'hidden',
                  border: '1px solid var(--border)',
                }}
              >
                {results.map((r, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      setSelected(r)
                      setQuery(r.displayName)
                    }}
                    style={{
                      width: '100%',
                      padding: '12px 14px',
                      background:
                        i % 2 === 0
                          ? 'var(--surface)'
                          : 'var(--surface-raised)',
                      border: 'none',
                      borderBottom:
                        i < results.length - 1
                          ? '1px solid var(--border)'
                          : 'none',
                      color: 'var(--text-primary)',
                      fontSize: 'var(--text-sm)',
                      textAlign: 'left',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 10,
                      fontFamily: 'inherit',
                      transition: 'background 0.15s ease',
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.background =
                        'var(--surface-hover)')
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.background =
                        i % 2 === 0
                          ? 'var(--surface)'
                          : 'var(--surface-raised)')
                    }
                  >
                    <MapPin
                      size={14}
                      color="var(--accent)"
                      style={{ flexShrink: 0 }}
                    />
                    <div>
                      <div style={{ fontWeight: 500 }}>{r.cityName}</div>
                      <div
                        style={{
                          color: 'var(--text-tertiary)',
                          fontSize: 'var(--text-xs)',
                          marginTop: 2,
                        }}
                      >
                        {r.country} · {r.continent}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
            {isSearching && (
              <div
                style={{
                  textAlign: 'center',
                  padding: 16,
                  color: 'var(--text-tertiary)',
                  fontSize: 'var(--text-sm)',
                }}
              >
                Searching...
              </div>
            )}
          </div>
        ) : (
          <div>
            {/* Selected city */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '12px 14px',
                background: 'var(--accent-light)',
                borderRadius: 8,
                marginBottom: 16,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <MapPin size={16} color="var(--accent)" />
                <div>
                  <div style={{ fontWeight: 500 }}>{selected.cityName}</div>
                  <div
                    style={{
                      fontSize: 'var(--text-xs)',
                      color: 'var(--text-secondary)',
                    }}
                  >
                    {selected.country} · {selected.continent}
                  </div>
                </div>
              </div>
              <button
                onClick={() => {
                  setSelected(null)
                  setQuery('')
                }}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--text-tertiary)',
                  cursor: 'pointer',
                }}
              >
                <X size={16} />
              </button>
            </div>

            {/* Date */}
            <div style={{ marginBottom: 16 }}>
              <Input
                label="When did you visit?"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                icon={<Calendar size={16} />}
              />
            </div>

            {/* Note */}
            <div style={{ marginBottom: 20 }}>
              <label
                style={{
                  display: 'block',
                  fontSize: 'var(--text-sm)',
                  color: 'var(--text-secondary)',
                  fontWeight: 500,
                  marginBottom: 6,
                }}
              >
                Note (optional)
              </label>
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value.slice(0, 280))}
                placeholder="Any memories from this trip?"
                maxLength={280}
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  background: 'var(--surface)',
                  border: '1px solid var(--border)',
                  borderRadius: 8,
                  color: 'var(--text-primary)',
                  fontSize: 'var(--text-base)',
                  fontFamily: 'inherit',
                  outline: 'none',
                  resize: 'vertical',
                  minHeight: 72,
                  transition: 'border-color 0.2s ease',
                }}
                onFocus={(e) =>
                  (e.target.style.borderColor = 'var(--accent)')
                }
                onBlur={(e) =>
                  (e.target.style.borderColor = 'var(--border)')
                }
              />
              <div
                style={{
                  textAlign: 'right',
                  fontSize: 'var(--text-xs)',
                  color: 'var(--text-tertiary)',
                  marginTop: 4,
                }}
              >
                {note.length}/280
              </div>
            </div>

            {/* Submit */}
            <Button fullWidth onClick={handleSubmit}>
              <Sparkles size={16} />
              Reveal on map →
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
