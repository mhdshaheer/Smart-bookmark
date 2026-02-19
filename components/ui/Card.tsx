import React from 'react'

interface CardProps {
  children: React.ReactNode
  className?: string
  innerClassName?: string
  showShine?: boolean
  showDecoration?: boolean
}

export default function Card({ 
  children, 
  className = '', 
  innerClassName = '',
  showShine = true,
  showDecoration = false 
}: CardProps) {
  return (
    <div className={`bg-background border border-border rounded-3xl relative overflow-hidden group ${showShine ? 'card-shine' : ''} ${className}`}>
      {showDecoration && (
        <>
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-accent to-transparent opacity-50" />
          <div className="absolute -top-24 -right-24 w-48 h-48 bg-accent/5 rounded-full blur-3xl group-hover:bg-accent/10 transition-colors" />
        </>
      )}
      <div className={`relative z-10 ${innerClassName}`}>
        {children}
      </div>
    </div>
  )
}
