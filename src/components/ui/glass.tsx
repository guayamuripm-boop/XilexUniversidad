'use client'

import { cn } from '@/lib/utils'
import { forwardRef, type HTMLAttributes, useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'

interface GlassCardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'dark' | 'light' | 'glow'
  intensity?: 'subtle' | 'medium' | 'strong'
  hover?: boolean
  children: React.ReactNode
}

export const GlassCard = forwardRef<HTMLDivElement, GlassCardProps>(
  ({ className, variant = 'default', intensity = 'medium', hover = true, children, ...props }, ref) => {
    const baseStyles = `
      backdrop-blur-xl
      border border-white/[0.08]
      shadow-[0_8px_32px_rgba(0,0,0,0.3),inset_0_1px_0_rgba(255,255,255,0.06)]
      transition-all duration-300
      rounded-2xl
    `
    
    const variantStyles = {
      default: `
        bg-white/[0.04]
        ${intensity === 'strong' ? 'bg-white/[0.07] border-white/[0.1]' : ''}
        ${intensity === 'subtle' ? 'bg-white/[0.02] border-white/[0.05]' : ''}
      `,
      dark: `
        bg-graphite-925/80
        border-white/[0.06]
      `,
      light: `
        bg-white/[0.06]
        border-white/[0.1]
      `,
      glow: `
        bg-white/[0.04]
        border-primary/15
        hover:border-primary/25
        hover:shadow-[0_0_20px_rgba(0,180,216,0.1)]
      `,
    }

    const hoverStyles = hover ? `
      hover:shadow-[0_12px_48px_rgba(0,0,0,0.4),inset_0_1px_0_rgba(255,255,255,0.08)]
      hover:border-white/[0.12]
      hover:bg-white/[0.06]
      hover:scale-[1.01]
    ` : ''

    return (
      <div
        ref={ref}
        className={cn(baseStyles, variantStyles[variant], hoverStyles, className)}
        {...props}
      >
        {children}
      </div>
    )
  }
)

GlassCard.displayName = 'GlassCard'

export const GlassPanel = forwardRef<HTMLDivElement, GlassCardProps>(
  ({ className, variant = 'default', intensity = 'medium', children, ...props }, ref) => {
    const baseStyles = `
      backdrop-blur-2xl
      border border-white/[0.05]
      shadow-[0_2px_16px_rgba(0,0,0,0.2)]
    `
    
    const variantStyles = {
      default: `
        bg-white/[0.03]
        ${intensity === 'strong' ? 'bg-white/[0.05]' : ''}
      `,
      dark: 'bg-graphite-925/90 border-white/[0.04]',
      light: 'bg-white/[0.05] border-white/[0.08]',
      glow: 'bg-white/[0.03] border-primary/10',
    }

    return (
      <div
        ref={ref}
        className={cn('rounded-xl', baseStyles, variantStyles[variant], className)}
        {...props}
      >
        {children}
      </div>
    )
  }
)

GlassPanel.displayName = 'GlassPanel'

export const GlassButton = forwardRef<HTMLButtonElement, React.ButtonHTMLAttributes<HTMLButtonElement> & { 
  variant?: 'primary' | 'secondary' | 'ghost' | 'outline'
  size?: 'sm' | 'md' | 'lg'
}>(
  ({ className, variant = 'primary', size = 'md', disabled, children, ...props }, ref) => {
    const baseStyles = `
      font-semibold rounded-xl transition-all duration-200
      focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-2 focus:ring-offset-graphite-950
      disabled:opacity-40 disabled:cursor-not-allowed
      active:scale-[0.97]
    `
    
    const variantStyles = {
      primary: `
        bg-gradient-to-r from-primary to-primary-600 text-white
        hover:from-primary-600 hover:to-primary-700
        shadow-[0_4px_14px_rgba(0,180,216,0.3)]
        hover:shadow-[0_6px_20px_rgba(0,180,216,0.4)]
      `,
      secondary: `
        bg-primary/10 text-primary border border-primary/20
        hover:bg-primary/20 hover:border-primary/30
      `,
      outline: `
        border-2 border-primary/40 text-primary
        hover:bg-primary/10 hover:border-primary/60
        bg-transparent
      `,
      ghost: `
        text-graphite-300
        hover:bg-white/[0.06] hover:text-white
        bg-transparent
      `,
    }

    const sizeStyles = {
      sm: 'px-3 py-1.5 text-sm gap-1.5',
      md: 'px-5 py-2.5 text-base gap-2',
      lg: 'px-7 py-3.5 text-lg gap-2.5',
    }

    return (
      <button
        ref={ref}
        className={cn(
          'inline-flex items-center justify-center',
          baseStyles,
          variantStyles[variant],
          sizeStyles[size],
          className
        )}
        disabled={disabled}
        {...props}
      >
        {children}
      </button>
    )
  }
)

GlassButton.displayName = 'GlassButton'

export const GlassInput = forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement> & { 
  label?: string
  error?: string
  icon?: React.ReactNode
  togglePassword?: boolean
  showPassword?: boolean
  onTogglePassword?: () => void
}>(
  ({ className, label, error, icon, id, togglePassword, showPassword, onTogglePassword, ...props }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, '-')
    const [internalShowPassword, setInternalShowPassword] = useState(false)
    const isPassword = props.type === 'password'
    const displayShowPassword = togglePassword ? (showPassword ?? internalShowPassword) : false
    const handleToggle = () => {
      if (onTogglePassword) {
        onTogglePassword()
      } else {
        setInternalShowPassword(!internalShowPassword)
      }
    }

    return (
      <div className="w-full">
        {label && (
          <label htmlFor={inputId} className="block text-sm font-medium text-graphite-300 mb-1.5">
            {label}
          </label>
        )}
        <div className="relative">
          {icon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-graphite-500">
              {icon}
            </div>
          )}
          <input
            ref={ref}
            id={inputId}
            type={isPassword && !displayShowPassword ? 'password' : 'text'}
            className={cn(
              'w-full rounded-xl border bg-white/[0.04] backdrop-blur-sm',
              'text-graphite-100 placeholder-graphite-500',
              'transition-all duration-200',
              'focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/30 focus:bg-white/[0.06]',
              'disabled:opacity-50 disabled:cursor-not-allowed',
              icon ? 'pl-10' : 'pl-4',
              displayShowPassword ? 'pr-12' : 'pr-4',
              'py-3',
              error 
                ? 'border-red-500/40 focus:ring-red-500/40' 
                : 'border-white/[0.08] hover:border-white/[0.12]',
              className
            )}
            aria-invalid={error ? 'true' : 'false'}
            aria-describedby={error ? `${inputId}-error` : undefined}
            {...props}
          />
          {isPassword && togglePassword && (
            <button
              type="button"
              onClick={handleToggle}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-graphite-500 hover:text-graphite-300 transition-colors"
              aria-label={displayShowPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
            >
              {displayShowPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          )}
        </div>
        {error && (
          <p id={`${inputId}-error`} className="mt-1.5 text-sm text-red-400" role="alert">
            {error}
          </p>
        )}
      </div>
    )
  }
)

GlassInput.displayName = 'GlassInput'
