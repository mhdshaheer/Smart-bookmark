import React from 'react'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  prefixCode?: string
}

export default function Input({ label, error, prefixCode, className = '', ...props }: InputProps) {
  return (
    <div className="space-y-3">
      {label && (
        <label className="block text-[10px] font-mono font-bold text-zinc-500 uppercase tracking-[0.2em]">
          {prefixCode && <span className="mr-2 opacity-50">{prefixCode} //</span>}
          {label}
        </label>
      )}
      <input
        className={`w-full h-12 px-4 bg-background border border-border rounded-xl text-sm text-foreground focus:border-accent focus:ring-1 focus:ring-accent outline-none transition-all placeholder:text-zinc-500 font-medium ${className}`}
        {...props}
      />
      {error && (
        <div className="text-[10px] font-mono font-bold text-red-500 uppercase flex items-center gap-2 bg-red-500/5 p-3 rounded-lg border border-red-500/20">
          <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
          {error}
        </div>
      )}
    </div>
  )
}
