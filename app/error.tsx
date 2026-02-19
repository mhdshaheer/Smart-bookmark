'use client'

import { useEffect } from 'react'
import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 text-center">
      <Card className="max-w-md w-full p-12 shadow-2xl" showDecoration={true}>
        <div className="w-16 h-16 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-500 mb-8 mx-auto">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
            <line x1="12" y1="9" x2="12" y2="13" />
            <line x1="12" y1="17" x2="12.01" y2="17" />
          </svg>
        </div>
        
        <h2 className="text-3xl font-bold text-foreground tracking-tighter mb-4 uppercase">System Error</h2>
        <p className="text-muted text-sm font-medium mb-10 leading-relaxed">
          An unexpected exception occurred in the application kernel. The operation has been halted to prevent data corruption.
        </p>

        <div className="flex flex-col gap-3">
          <Button 
            variant="primary" 
            size="lg" 
            onClick={() => reset()}
            className="w-full"
          >
            Attempt Retry
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => window.location.href = '/'}
            className="w-full"
          >
            Return to Core
          </Button>
        </div>

        <div className="mt-12 pt-6 border-t border-border flex items-center justify-between">
          <span className="text-[9px] font-mono text-muted uppercase tracking-widest">Fault // ID: {error.digest?.toUpperCase().slice(0, 12) || 'UNKNOWN'}</span>
          <div className="flex items-center gap-1">
            <div className="w-1 h-1 rounded-full bg-red-500 animate-pulse" />
            <span className="text-[9px] font-mono text-muted uppercase">Suspended</span>
          </div>
        </div>
      </Card>
    </div>
  )
}
