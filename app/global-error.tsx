'use client'

import Button from '@/components/ui/Button'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <html>
      <body className="bg-background text-foreground flex items-center justify-center min-h-screen">
        <div className="max-w-md w-full p-8 text-center border border-border rounded-3xl bg-background shadow-2xl">
          <h2 className="text-2xl font-bold mb-4 uppercase tracking-tighter">Critical Runtime Failure</h2>
          <p className="text-muted text-sm mb-8">
            The application core has experienced a fatal exception. Automatic recovery is required.
          </p>
          <Button variant="primary" onClick={() => reset()} className="w-full">
            Restart Application
          </Button>
        </div>
      </body>
    </html>
  )
}
