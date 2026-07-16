'use client'

import { cn } from '@/lib/utils'
import { forwardRef, type HTMLAttributes, useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'

interface GlassCardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'ocean' | 'glow'
  intensity?: 'subtle' | 'medium' | 'strong'
  hover?: boolean
  children: React.ReactNode
}

export const GlassCard = forwardRef<HTMLDivElement, GlassCardProps>(
  ({ className, variant = 'default', intensity = 'medium', hover = true, children, ...props }, ref) => {
    const baseStyles = `
      backdrop-blur-xl
      border border-white/[0.08]
      shadow-[0_8px_32px_rgba(0,0,0,0.4),inset_0_1px_0_rgba(255,255,255,0.06)]
      transition-all duration-300
      rounded-3xl
    `
    
    const variantStyles = {
      default: `
        bg-white/[0.05]
        ${intensity === 'strong' ? 'bg-white/[0.08] border-white/[0.1]' : ''}
        ${intensity === 'subtle' ? 'bg-white/[0.03] border-white/[0.05]' : ''}
      `,
      ocean: `
        bg-gradient-to-br from-white/[0.06] to-white/[0.02]
        border-primary/15
      `,
      glow: `
        bg-white/[0.05]
        border-primary/15
        hover:border-primary/25
        hover:shadow-[0_0_24px_rgba(20,184,166,0.15)]
      `,
    }

    const hoverStyles = hover ? `
      hover:shadow-[0_16px_48px_rgba(0,0,0,0.5),inset_0_1px_0_rgba(255,255,255,0.08)]
      hover:border-white/[0.14]
      hover:bg-white/[0.07]
      hover:scale-[1.01]
      hover:-translate-y-0.5
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
      border border-white/[0.06]
      shadow-[0_4px_20px_rgba(0,0,0,0.3)]
      rounded-2xl
    `
    
    const variantStyles = {
      default: `
        bg-white/[0.04]
        ${intensity === 'strong' ? 'bg-white/[0.06]' : ''}
      `,
      ocean: 'bg-gradient-to-br from-white/[0.05] to-white/[0.02] border-primary/10',
      glow: 'bg-white/[0.04] border-primary/10',
    }

    return (
      <div
        ref={ref}
        className={cn(baseStyles, variantStyles[variant], className)}
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
      font-semibold rounded-2xl transition-all duration-300
      focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-2 focus:ring-offset-deep-950
      disabled:opacity-40 disabled:cursor-not-allowed
      active:scale-[0.97]
    `
    
    const variantStyles = {
      primary: `
        bg-gradient-to-r from-primary to-primary-600 text-white
        hover:from-primary-600 hover:to-primary-700
        shadow-[0_4px_20px_rgba(20,184,166,0.35)]
        hover:shadow-[0_8px_30px_rgba(20,184,166,0.45)]
        hover:-translate-y-0.5
      `,
      secondary: `
        bg-primary/10 text-primary border border-primary/20
        hover:bg-primary/20 hover:border-primary/30
      `,
      outline: `
        border-2 border-primary/30 text-primary
        hover:bg-primary/10 hover:border-primary/50
        bg-transparent
      `,
      ghost: `
        text-blue-200
        hover:bg-white/[0.06] hover:text-white
        bg-transparent
      `,
    }

    const sizeStyles = {
      sm: 'px-3.5 py-2 text-sm gap-1.5',
      md: 'px-6 py-3 text-base gap-2',
      lg: 'px-8 py-4 text-lg gap-2.5',
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
          <label htmlFor={inputId} className="block text-sm font-medium text-blue-200 mb-1.5">
            {label}
          </label>
        )}
        <div className="relative">
          {icon && (
            <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-blue-300/50">
              {icon}
            </div>
          )}
          <input
            ref={ref}
            id={inputId}
            type={isPassword && !displayShowPassword ? 'password' : 'text'}
            className={cn(
              'w-full rounded-2xl border bg-white/[0.05] backdrop-blur-sm',
              'text-blue-50 placeholder-blue-300/40',
              'transition-all duration-300',
              'focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/30 focus:bg-white/[0.07] focus:shadow-glow-sm',
              'disabled:opacity-40 disabled:cursor-not-allowed',
              icon ? 'pl-11' : 'pl-4',
              displayShowPassword ? 'pr-12' : 'pr-4',
              'py-3.5',
              error 
                ? 'border-red-500/40 focus:ring-red-500/40' 
                : 'border-white/[0.08] hover:border-white/[0.14]',
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
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-blue-300/50 hover:text-blue-200 transition-colors"
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
