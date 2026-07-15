'use client'

import { cn } from '@/lib/utils'
import { forwardRef, type HTMLAttributes, useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'

interface GlassCardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'dark' | 'light'
  intensity?: 'subtle' | 'medium' | 'strong'
  hover?: boolean
  children: React.ReactNode
}

export const GlassCard = forwardRef<HTMLDivElement, GlassCardProps>(
  ({ className, variant = 'default', intensity = 'medium', hover = true, children, ...props }, ref) => {
    const baseStyles = `
      backdrop-blur-xl
      border border-white/20 dark:border-white/10
      shadow-[0_4px_20px_rgba(0,0,0,0.08)] dark:shadow-[0_4px_30px_rgba(0,0,0,0.3)]
      transition-all duration-300
    `
    
    const variantStyles = {
      default: `
        bg-white/70 dark:bg-[#0B1F1E]/70
        ${intensity === 'strong' && 'bg-white/80 dark:bg-[#0B1F1E]/80'}
        ${intensity === 'subtle' && 'bg-white/50 dark:bg-[#0B1F1E]/50'}
      `,
      dark: `
        bg-[#0B1F1E]/80 dark:bg-[#0B1F1E]/90
        border-teal-500/20
      `,
      light: `
        bg-white/80 dark:bg-white/10
      `,
    }

    const hoverStyles = hover ? `
      hover:shadow-[0_8px_30px_rgba(14,165,160,0.15)] dark:hover:shadow-[0_8px_30px_rgba(94,234,212,0.1)]
      hover:border-teal-400/30 dark:hover:border-teal-400/20
      hover:scale-[1.01]
    ` : ''

    return (
      <div
        ref={ref}
        className={cn(
          'rounded-2xl',
          baseStyles,
          variantStyles[variant],
          hoverStyles,
          className
        )}
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
      border border-white/10 dark:border-white/5
      shadow-[0_2px_10px_rgba(0,0,0,0.05)] dark:shadow-[0_2px_20px_rgba(0,0,0,0.2)]
    `
    
    const variantStyles = {
      default: `
        bg-white/50 dark:bg-[#0B1F1E]/50
        ${intensity === 'strong' && 'bg-white/60 dark:bg-[#0B1F1E]/60'}
      `,
      dark: 'bg-[#0B1F1E]/90 border-teal-500/10',
      light: 'bg-white/60 dark:bg-white/5',
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
      font-medium rounded-xl transition-all duration-200
      focus:outline-none focus:ring-2 focus:ring-teal-500/50 focus:ring-offset-2
      disabled:opacity-50 disabled:cursor-not-allowed
      active:scale-[0.98]
    `
    
    const variantStyles = {
      primary: `
        bg-teal-600 text-white
        hover:bg-teal-700
        shadow-[0_4px_14px_rgba(14,165,160,0.3)]
        dark:bg-teal-500 dark:hover:bg-teal-600
      `,
      secondary: `
        bg-teal-100 text-teal-800 dark:bg-teal-900/30 dark:text-teal-300
        hover:bg-teal-200 dark:hover:bg-teal-900/50
      `,
      outline: `
        border-2 border-teal-500 text-teal-600 dark:text-teal-400
        hover:bg-teal-500 hover:text-white dark:hover:bg-teal-500
        bg-transparent
      `,
      ghost: `
        text-teal-600 dark:text-teal-400
        hover:bg-teal-100 dark:hover:bg-teal-900/20
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
          <label htmlFor={inputId} className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
            {label}
          </label>
        )}
        <div className="relative">
          {icon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500">
              {icon}
            </div>
          )}
          <input
            ref={ref}
            id={inputId}
            type={isPassword && !displayShowPassword ? 'password' : 'text'}
            className={cn(
              'w-full rounded-xl border bg-white/80 dark:bg-[#0B1F1E]/80 backdrop-blur-sm',
              'text-gray-900 dark:text-gray-100 placeholder-gray-400',
              'transition-all duration-200',
              'focus:outline-none focus:ring-2 focus:ring-teal-500/50 focus:border-transparent',
              'disabled:opacity-50 disabled:cursor-not-allowed',
              icon ? 'pl-10' : 'pl-4',
              displayShowPassword ? 'pr-12' : 'pr-4',
              'py-3',
              error 
                ? 'border-red-300 focus:ring-red-500/50' 
                : 'border-gray-200 dark:border-gray-700 hover:border-teal-300 dark:hover:border-teal-600',
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
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              aria-label={displayShowPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
            >
              {displayShowPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          )}
        </div>
        {error && (
          <p id={`${inputId}-error`} className="mt-1.5 text-sm text-red-600 dark:text-red-400" role="alert">
            {error}
          </p>
        )}
      </div>
    )
  }
)

GlassInput.displayName = 'GlassInput'