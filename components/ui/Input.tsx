'use client'

import { forwardRef, InputHTMLAttributes } from 'react'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  icon?: React.ReactNode
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, icon, style, ...props }, ref) => {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6, width: '100%' }}>
        {label && (
          <label
            style={{
              fontSize: 'var(--text-sm)',
              color: 'var(--text-secondary)',
              fontWeight: 500,
            }}
          >
            {label}
          </label>
        )}
        <div style={{ position: 'relative' }}>
          {icon && (
            <div
              style={{
                position: 'absolute',
                left: 12,
                top: '50%',
                transform: 'translateY(-50%)',
                color: 'var(--text-tertiary)',
                display: 'flex',
                alignItems: 'center',
              }}
            >
              {icon}
            </div>
          )}
          <input
            ref={ref}
            style={{
              width: '100%',
              padding: '10px 14px',
              paddingLeft: icon ? 40 : 14,
              background: 'var(--surface)',
              border: `1px solid ${error ? 'var(--danger)' : 'var(--border)'}`,
              borderRadius: 8,
              color: 'var(--text-primary)',
              fontSize: 'var(--text-base)',
              fontFamily: 'inherit',
              outline: 'none',
              transition: 'border-color 0.2s ease',
              ...style,
            }}
            onFocus={(e) => {
              e.target.style.borderColor = error
                ? 'var(--danger)'
                : 'var(--accent)'
              props.onFocus?.(e)
            }}
            onBlur={(e) => {
              e.target.style.borderColor = error
                ? 'var(--danger)'
                : 'var(--border)'
              props.onBlur?.(e)
            }}
            {...props}
          />
        </div>
        {error && (
          <span style={{ fontSize: 'var(--text-xs)', color: 'var(--danger)' }}>
            {error}
          </span>
        )}
      </div>
    )
  }
)

Input.displayName = 'Input'
