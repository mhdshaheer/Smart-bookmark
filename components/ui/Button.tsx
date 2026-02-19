import React from 'react'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  isLoading?: boolean
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
}

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  isLoading,
  leftIcon,
  rightIcon,
  className = '',
  ...props
}: ButtonProps) {
  const baseStyles = 'inline-flex items-center justify-center gap-2 font-bold uppercase tracking-widest transition-all active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none'
  
  const variants = {
    primary: 'bg-foreground text-background hover:opacity-90 technical-glow',
    secondary: 'border border-border text-foreground hover:bg-secondary',
    danger: 'bg-red-500 text-white hover:bg-red-600 shadow-lg shadow-red-500/20',
    ghost: 'text-muted hover:text-foreground hover:bg-secondary'
  }
  
  const sizes = {
    sm: 'px-3 py-1.5 text-[10px] font-mono rounded-lg',
    md: 'px-6 py-3 text-xs rounded-xl',
    lg: 'px-8 py-4 text-sm rounded-xl'
  }

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={isLoading || props.disabled}
      {...props}
    >
      {isLoading ? (
        <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      ) : (
        <>
          {leftIcon}
          {children}
          {rightIcon}
        </>
      )}
    </button>
  )
}
