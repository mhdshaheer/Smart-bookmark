import Link from 'next/link'
import { createClient } from '@/lib/supabaseServer'
import ThemeToggle from '@/components/ThemeToggle'

export default async function LandingPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  return (
    <div className="min-h-screen grid-bg flex flex-col items-center bg-background text-foreground transition-colors duration-300">
      {/* Navbar */}
      <nav className="w-full border-b border-border bg-background/50 backdrop-blur-md fixed top-0 z-50">
        <div className="max-w-screen-xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-accent flex items-center justify-center text-white">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 21l-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
              </svg>
            </div>
            <span className="font-bold text-sm tracking-tight text-foreground uppercase">SmartBookmark</span>
          </div>
          <div className="flex items-center gap-6">
            <Link href={user ? "/dashboard" : "/login"} className="text-[10px] font-bold text-zinc-500 hover:text-foreground uppercase tracking-widest transition-colors">
              {user ? "Go to Dashboard" : "Sign In"}
            </Link>
            <div className="h-4 w-px bg-border" />
            <ThemeToggle />
          </div>
        </div>
      </nav>

      <main className="flex-1 w-full max-w-screen-xl px-6 flex flex-col items-center justify-center pt-20">
        <div className="flex flex-col items-center text-center animate-fade-in">
          <div className="px-3 py-1 rounded-full border border-border bg-secondary text-muted text-[10px] font-mono tracking-[0.2em] uppercase mb-8 flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse shadow-[0_0_8px_var(--color-accent)]" />
            Your Personal Link Library
          </div>
          
          <h1 className="text-5xl md:text-8xl font-bold tracking-tighter text-foreground mb-8 max-w-4xl leading-[1.1]">
            The smarter way to <span className="opacity-50">organize</span> your web.
          </h1>
          
          <p className="max-w-xl text-lg text-muted font-medium mb-12 leading-relaxed">
            Easily save, organize, and access your favorite links from anywhere. 
            Simple, secure, and synced in real-time.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              href={user ? "/dashboard" : "/login"}
              className="px-8 py-4 rounded-xl bg-foreground text-background font-bold text-sm uppercase tracking-widest hover:opacity-90 active:scale-[0.98] transition-all technical-glow"
            >
              {user ? "Open Dashboard" : "Get Started Now"}
            </Link>
          </div>
        </div>

        {/* System Overview Feature Grid */}
        <div className="mt-32 w-full grid grid-cols-1 md:grid-cols-3 gap-px bg-border border border-border rounded-3xl overflow-hidden shadow-2xl">
          <div className="bg-background p-12 group hover:bg-secondary/50 transition-colors">
            <div className="text-accent mb-6 font-mono text-xs opacity-50">01 // SYNC</div>
            <h3 className="text-lg font-bold text-foreground mb-3">Instant Sync</h3>
            <p className="text-muted text-sm leading-relaxed">Your bookmarks are instantly available across all your devices, powered by real-time technology.</p>
          </div>
          <div className="bg-background p-12 group hover:bg-secondary/50 transition-colors">
            <div className="text-accent mb-6 font-mono text-xs opacity-50">02 // SEC</div>
            <h3 className="text-lg font-bold text-foreground mb-3">Private & Secure</h3>
            <p className="text-muted text-sm leading-relaxed">Your data belongs to you. We use enterprise-grade security to keep your library private.</p>
          </div>
          <div className="bg-background p-12 group hover:bg-secondary/50 transition-colors">
            <div className="text-accent mb-6 font-mono text-xs opacity-50">03 // OPT</div>
            <h3 className="text-lg font-bold text-foreground mb-3">Lightning Fast</h3>
            <p className="text-muted text-sm leading-relaxed">Experience a smooth and responsive interface built for modern workflows and high performance.</p>
          </div>
        </div>
      </main>

      <footer className="w-full border-t border-border bg-background py-12 px-6">
        <div className="max-w-screen-xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex items-center gap-2 opacity-30 grayscale dark:invert-0 invert">
            <div className="w-5 h-5 rounded bg-foreground text-background flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                <path d="M19 21l-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
              </svg>
            </div>
            <span className="font-bold text-xs text-foreground">SmartBookmark</span>
          </div>
          <div className="flex gap-8 text-[11px] font-bold text-muted uppercase tracking-widest">
            <a href="#" className="hover:text-foreground transition-colors">Support</a>
            <a href="#" className="hover:text-foreground transition-colors">Privacy</a>
          </div>
          <p className="text-[11px] text-muted font-mono">© {new Date().getFullYear()}</p>
        </div>
      </footer>
    </div>
  )
}
