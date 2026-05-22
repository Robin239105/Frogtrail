'use client'

import { forwardRef, ButtonHTMLAttributes } from 'react'


interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  fullWidth?: boolean
  loading?: boolean
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      fullWidth = false,
      loading = false,
      className,
      children,
      disabled,
      style,
      ...props
    },
    ref
  ) => {
    const baseStyles: React.CSSProperties = {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 8,
      borderRadius: 8,
      fontWeight: 500,
      cursor: disabled || loading ? 'not-allowed' : 'pointer',
      transition: 'all 0.2s ease',
      border: 'none',
      outline: 'none',
      opacity: disabled || loading ? 0.5 : 1,
      width: fullWidth ? '100%' : 'auto',
      whiteSpace: 'nowrap',
      fontFamily: 'inherit',
    }

    const sizeStyles: Record<string, React.CSSProperties> = {
      sm: { padding: '6px 12px', fontSize: 'var(--text-sm)' },
      md: { padding: '10px 18px', fontSize: 'var(--text-base)' },
      lg: { padding: '12px 24px', fontSize: 'var(--text-lg)' },
    }

    const variantStyles: Record<string, React.CSSProperties> = {
      primary: {
        background: 'var(--accent)',
        color: '#ffffff',
      },
      secondary: {
        background: 'var(--surface-raised)',
        color: 'var(--text-primary)',
        border: '1px solid var(--border)',
      },
      ghost: {
        background: 'transparent',
        color: 'var(--text-secondary)',
      },
      danger: {
        background: 'var(--danger)',
        color: '#ffffff',
      },
    }

    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        style={{
          ...baseStyles,
          ...sizeStyles[size],
          ...variantStyles[variant],
          ...style,
        }}
        className={className}
        {...props}
      >
        {loading && (
          <span
            style={{
              width: 16,
              height: 16,
              border: '2px solid rgba(255,255,255,0.3)',
              borderTopColor: '#fff',
              borderRadius: '50%',
              animation: 'spin 0.6s linear infinite',
            }}
          />
        )}
        {children}
      </button>
    )
  }
)

Button.displayName = 'Button'
