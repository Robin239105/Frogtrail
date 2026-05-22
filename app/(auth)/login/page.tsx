'use client'

import { signIn } from 'next-auth/react'
import { Compass } from 'lucide-react'
import { Button } from '@/components/ui/Button'

export default function LoginPage() {
  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'var(--fog-bg)',
        padding: 16,
      }}
    >
      <div
        className="glass animate-fade-in"
        style={{
          width: '100%',
          maxWidth: 400,
          borderRadius: 16,
          padding: 40,
          textAlign: 'center',
        }}
      >
        {/* Logo */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 10,
            marginBottom: 32,
          }}
        >
          <Compass size={28} color="var(--accent)" />
          <span
            style={{
              fontSize: 'var(--text-xl)',
              fontWeight: 500,
              color: 'var(--text-primary)',
              letterSpacing: '-0.02em',
            }}
          >
            Fogtrail
          </span>
        </div>

        <h1
          style={{
            fontSize: 'var(--text-2xl)',
            fontWeight: 500,
            marginBottom: 8,
            margin: '0 0 8px',
          }}
        >
          Welcome back
        </h1>
        <p
          style={{
            color: 'var(--text-secondary)',
            fontSize: 'var(--text-sm)',
            marginBottom: 32,
            margin: '0 0 32px',
          }}
        >
          Sign in to continue exploring the world
        </p>

        <Button
          fullWidth
          size="lg"
          onClick={() => signIn('google', { callbackUrl: '/map' })}
          style={{
            background: '#ffffff',
            color: '#1f1f1f',
            gap: 12,
          }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24">
            <path
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
              fill="#4285F4"
            />
            <path
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              fill="#34A853"
            />
            <path
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              fill="#FBBC05"
            />
            <path
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              fill="#EA4335"
            />
          </svg>
          Continue with Google
        </Button>

        <p
          style={{
            marginTop: 24,
            fontSize: 'var(--text-xs)',
            color: 'var(--text-tertiary)',
          }}
        >
          By signing in, you agree to our Terms of Service
        </p>
      </div>
    </div>
  )
}
