'use client'

import { createClient } from '@/lib/supabaseClient'
import { useState } from 'react'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'

export default function LoginPage() {
  const [loading, setLoading] = useState(false)
  const supabase = createClient()

  const handleLogin = async () => {
    setLoading(true)
    try {
      // Use the current origin to construct the callback URL
      const origin = window.location.origin
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${origin}/auth/callback`,
        },
      })
      if (error) throw error
    } catch (error: any) {
      alert(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen grid-bg flex items-center justify-center px-4 bg-background selection:bg-accent/30 selection:text-white transition-colors duration-300">
      <Card 
        className="max-w-md w-full p-10 md:p-14 shadow-2xl" 
        showDecoration={true}
      >
        <div className="flex flex-col items-center text-center mb-12 relative z-10">
          <div className="w-12 h-12 rounded-xl bg-accent flex items-center justify-center text-white mb-8 technical-glow">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
              <path d="M19 21l-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
            </svg>
          </div>
          <h2 className="text-3xl font-bold text-foreground tracking-tighter mb-4 uppercase">Welcome Back</h2>
          <p className="text-muted text-sm font-medium leading-relaxed">
            Please sign in with your account to access your personal link gallery and manage your collection.
          </p>
        </div>

        <Button
          onClick={handleLogin}
          isLoading={loading}
          size="lg"
          className="w-full shadow-xl"
          leftIcon={
            <svg className="w-5 h-5 group-hover:scale-110 transition-transform" viewBox="0 0 48 48">
              <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
              <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
              <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
              <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
            </svg>
          }
        >
          Sign in with Google
        </Button>

        <div className="mt-14 pt-8 border-t border-border flex items-center justify-between">
          <span className="text-[9px] font-mono text-muted uppercase tracking-widest">Security Protocol</span>
          <div className="flex items-center gap-1">
            <div className="w-1 h-1 rounded-full bg-accent animate-pulse" />
            <span className="text-[9px] font-mono text-muted uppercase">Secure Login</span>
          </div>
        </div>
      </Card>
    </div>
  )
}
