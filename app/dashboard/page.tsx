'use client'

import { createClient } from '@/lib/supabaseClient'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { User } from '@supabase/supabase-js'
import BookmarkList from '@/components/BookmarkList'
import BookmarkForm from '@/components/BookmarkForm'
import LogoutButton from '@/components/LogoutButton'
import ThemeToggle from '@/components/ThemeToggle'
import Card from '@/components/ui/Card'

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    const getUser = async () => {
      try {
        const { data: { user }, error: authError } = await supabase.auth.getUser()
        if (authError) throw authError
        
        if (!user) {
          router.push('/login')
        } else {
          setUser(user)
        }
      } catch (err: any) {
        console.error('Auth error:', err.message)
        setError('Authentication failure. Please re-login.')
        // Delay redirect slightly to show error if needed
        setTimeout(() => router.push('/login'), 2000)
      } finally {
        setLoading(false)
      }
    }
    getUser()
  }, [router, supabase])

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-8 h-8 boundary border-4 border-accent border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 text-center">
        <div className="w-16 h-16 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-500 mb-6">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
          </svg>
        </div>
        <h2 className="text-xl font-bold text-foreground mb-2 uppercase tracking-tighter">Access Denied</h2>
        <p className="text-muted text-sm max-w-xs mb-8">{error}</p>
      </div>
    )
  }

  if (!user) return null

  return (
    <div className="min-h-screen bg-background flex flex-col selection:bg-accent/30 selection:text-white transition-colors duration-300">
      {/* System Header */}
      <header className="h-16 border-b border-border bg-background/80 backdrop-blur-xl sticky top-0 z-50 flex items-center px-4 md:px-8">
        <div className="flex-1 flex items-center gap-3 md:gap-4 overflow-hidden">
          <div className="w-8 h-8 md:w-9 md:h-9 rounded-xl bg-accent flex items-center justify-center text-white technical-glow shrink-0">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
              <path d="M19 21l-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
            </svg>
          </div>
          <div className="flex flex-col min-w-0">
            <span className="font-bold text-xs md:text-sm tracking-tight text-foreground uppercase leading-none truncate">SmartBookmark</span>
            <span className="text-[8px] md:text-[9px] font-mono text-muted uppercase tracking-widest mt-1">Dashboard // Personal</span>
          </div>
        </div>
        
        <div className="flex items-center gap-4 md:gap-6">
          <div className="hidden lg:flex flex-col items-end">
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[10px] font-mono text-muted uppercase tracking-widest">Active</span>
            </div>
            <span className="text-xs font-bold text-muted mt-0.5 truncate max-w-[150px]">{user.email}</span>
          </div>
          <div className="h-8 w-px bg-border hidden sm:block" />
          <div className="flex items-center gap-2 md:gap-3">
            <ThemeToggle />
            <LogoutButton />
          </div>
        </div>
      </header>

      <main className="flex-1 overflow-auto grid-bg p-4 md:p-8 lg:p-12">
        <div className="max-w-screen-2xl mx-auto grid grid-cols-12 gap-8 lg:gap-16 items-start">
          {/* Left: Input Controller */}
          <div className="col-span-12 lg:col-span-4 space-y-8 lg:space-y-12 animate-fade-in">
            <div className="px-2 lg:px-0">
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground tracking-tighter mb-4">
                Add Link
              </h1>
              <p className="text-muted text-sm font-medium leading-relaxed max-w-sm">
                Save your favorite resources and organize your personal library with ease.
              </p>
            </div>

            <Card className="p-6 md:p-8 shadow-2xl" showShine={true}>
              <div className="absolute top-4 right-6 flex items-center gap-1.5 grayscale opacity-30">
                <div className="w-1 h-1 rounded-full bg-muted" />
                <div className="w-1 h-1 rounded-full bg-muted" />
                <div className="w-1 h-1 rounded-full bg-muted" />
              </div>
              <BookmarkForm />
            </Card>
          </div>

          {/* Right: Repository List */}
          <div className="col-span-12 lg:col-span-8 animate-slide-in">
            <div className="flex items-center justify-between mb-8 pb-6 border-b border-border px-2 lg:px-0">
              <div className="flex items-center gap-4">
                <h2 className="text-sm font-bold text-muted uppercase tracking-widest">Saved Bookmarks</h2>
                <div className="px-2 py-0.5 rounded bg-secondary text-[10px] font-bold text-accent uppercase tracking-tighter">Live</div>
              </div>
              <span className="text-[10px] font-mono text-muted uppercase hidden sm:block">Latest First</span>
            </div>
            <div className="px-2 lg:px-0">
              <BookmarkList />
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
