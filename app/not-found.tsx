import Link from 'next/link'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 text-center">
      <Card className="max-w-md w-full p-12 shadow-2xl" showDecoration={true}>
        <div className="w-16 h-16 rounded-2xl bg-accent/10 border border-accent/20 flex items-center justify-center text-accent mb-8 mx-auto">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
        </div>
        
        <h2 className="text-3xl font-bold text-foreground tracking-tighter mb-4 uppercase">Node Not Found</h2>
        <p className="text-muted text-sm font-medium mb-10 leading-relaxed">
          The requested coordinate does not exist in the repository or has been permanently decommissioned.
        </p>

        <Link href="/">
          <Button variant="primary" size="lg" className="w-full">
            Back to Base
          </Button>
        </Link>

        <div className="mt-12 pt-6 border-t border-border flex items-center justify-between">
          <span className="text-[9px] font-mono text-muted uppercase tracking-widest">Status // 404</span>
          <div className="flex items-center gap-1">
            <div className="w-1 h-1 rounded-full bg-accent animate-pulse" />
            <span className="text-[9px] font-mono text-muted uppercase">Void</span>
          </div>
        </div>
      </Card>
    </div>
  )
}
