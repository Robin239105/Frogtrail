'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Save, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Card } from '@/components/ui/Card'

export default function SettingsPage() {
  const { data: session } = useSession()
  const router = useRouter()
  const [username, setUsername] = useState('')
  const [fogRadius, setFogRadius] = useState(150)
  const [isPublic, setIsPublic] = useState(true)
  const [showOnLeaderboard, setShowOnLeaderboard] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    if (session?.user?.username) {
      setUsername(session.user.username)
    }
  }, [session])

  const handleSave = async () => {
    setSaving(true)
    try {
      await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, fogRadius, isPublic, showOnLeaderboard }),
      })
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'var(--fog-bg)',
        padding: '24px',
        maxWidth: 600,
        margin: '0 auto',
      }}
    >
      {/* Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          marginBottom: 32,
        }}
      >
        <button
          onClick={() => router.push('/map')}
          style={{
            background: 'none',
            border: 'none',
            color: 'var(--text-secondary)',
            cursor: 'pointer',
            padding: 4,
          }}
        >
          <ArrowLeft size={20} />
        </button>
        <h1 style={{ fontSize: 'var(--text-xl)', fontWeight: 500, margin: 0 }}>
          Settings
        </h1>
      </div>

      {/* Profile section */}
      <Card style={{ marginBottom: 16 }}>
        <h2
          style={{
            fontSize: 'var(--text-base)',
            fontWeight: 500,
            margin: '0 0 16px',
          }}
        >
          Profile
        </h2>
        <Input
          label="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9]/g, ''))}
          placeholder="yourname"
        />
        <p
          style={{
            fontSize: 'var(--text-xs)',
            color: 'var(--text-tertiary)',
            marginTop: 6,
          }}
        >
          Your public profile will be at fogtrail.app/@{username}
        </p>
      </Card>

      {/* Map section */}
      <Card style={{ marginBottom: 16 }}>
        <h2
          style={{
            fontSize: 'var(--text-base)',
            fontWeight: 500,
            margin: '0 0 16px',
          }}
        >
          Map
        </h2>
        <div>
          <label
            style={{
              fontSize: 'var(--text-sm)',
              color: 'var(--text-secondary)',
              fontWeight: 500,
              display: 'block',
              marginBottom: 8,
            }}
          >
            Fog reveal radius: {fogRadius} km
          </label>
          <input
            type="range"
            min="50"
            max="500"
            step="10"
            value={fogRadius}
            onChange={(e) => setFogRadius(Number(e.target.value))}
            style={{
              width: '100%',
              accentColor: 'var(--accent)',
            }}
          />
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              fontSize: 'var(--text-xs)',
              color: 'var(--text-tertiary)',
              marginTop: 4,
            }}
          >
            <span>50 km</span>
            <span>500 km</span>
          </div>
        </div>
      </Card>

      {/* Privacy section */}
      <Card style={{ marginBottom: 16 }}>
        <h2
          style={{
            fontSize: 'var(--text-base)',
            fontWeight: 500,
            margin: '0 0 16px',
          }}
        >
          Privacy
        </h2>
        <label
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            cursor: 'pointer',
            marginBottom: 12,
          }}
        >
          <span style={{ fontSize: 'var(--text-sm)' }}>Public profile</span>
          <input
            type="checkbox"
            checked={isPublic}
            onChange={(e) => setIsPublic(e.target.checked)}
            style={{ accentColor: 'var(--accent)', width: 18, height: 18 }}
          />
        </label>
        <label
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            cursor: 'pointer',
          }}
        >
          <span style={{ fontSize: 'var(--text-sm)' }}>Show on leaderboard</span>
          <input
            type="checkbox"
            checked={showOnLeaderboard}
            onChange={(e) => setShowOnLeaderboard(e.target.checked)}
            style={{ accentColor: 'var(--accent)', width: 18, height: 18 }}
          />
        </label>
      </Card>

      {/* Save */}
      <Button fullWidth onClick={handleSave} loading={saving}>
        <Save size={16} />
        {saved ? 'Saved!' : 'Save changes'}
      </Button>

      {/* Danger zone */}
      <Card style={{ marginTop: 32, borderColor: 'rgba(226, 75, 74, 0.2)' }}>
        <h2
          style={{
            fontSize: 'var(--text-base)',
            fontWeight: 500,
            margin: '0 0 8px',
            color: 'var(--danger)',
          }}
        >
          Danger zone
        </h2>
        <p
          style={{
            fontSize: 'var(--text-sm)',
            color: 'var(--text-tertiary)',
            marginBottom: 16,
          }}
        >
          Permanently delete your account and all visits. This cannot be undone.
        </p>
        <Button variant="danger" size="sm">
          <Trash2 size={14} />
          Delete account
        </Button>
      </Card>
    </div>
  )
}
