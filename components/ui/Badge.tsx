'use client'

import type { ReactNode } from 'react'

interface BadgeProps {
  children: ReactNode
  variant?: 'accent' | 'secondary' | 'warning' | 'danger'
  size?: 'sm' | 'md'
}

export function Badge({ children, variant = 'accent', size = 'sm' }: BadgeProps) {
  const colors: Record<string, { bg: string; text: string }> = {
    accent: { bg: 'var(--accent-light)', text: 'var(--accent)' },
    secondary: { bg: 'rgba(139, 154, 176, 0.15)', text: 'var(--text-secondary)' },
    warning: { bg: 'rgba(239, 159, 39, 0.15)', text: 'var(--warning)' },
    danger: { bg: 'rgba(226, 75, 74, 0.15)', text: 'var(--danger)' },
  }

  const { bg, text } = colors[variant]

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 4,
        padding: size === 'sm' ? '3px 8px' : '5px 12px',
        borderRadius: 100,
        fontSize: size === 'sm' ? 'var(--text-xs)' : 'var(--text-sm)',
        fontWeight: 500,
        background: bg,
        color: text,
        whiteSpace: 'nowrap',
      }}
    >
      {children}
    </span>
  )
}
