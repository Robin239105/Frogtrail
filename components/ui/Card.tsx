'use client'

import type { ReactNode, CSSProperties } from 'react'

interface CardProps {
  children: ReactNode
  style?: CSSProperties
  hoverable?: boolean
  className?: string
}

export function Card({ children, style, hoverable = false, className }: CardProps) {
  return (
    <div
      className={`glass ${hoverable ? 'glass-hover' : ''} ${className ?? ''}`}
      style={{
        borderRadius: 12,
        padding: 20,
        ...style,
      }}
    >
      {children}
    </div>
  )
}
