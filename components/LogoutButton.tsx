'use client'

import { createClient } from '@/lib/supabaseClient'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import Button from './ui/Button'

export default function LogoutButton() {
  const supabase = createClient()
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const handleLogout = async () => {
    setLoading(true)
    await supabase.auth.signOut()
    router.push('/')
    router.refresh()
  }

  return (
    <Button
      variant="secondary"
      size="sm"
      onClick={handleLogout}
      isLoading={loading}
      leftIcon={
        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 opacity-50 group-hover:opacity-100 transition-opacity" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
          <path d="M18.36 6.64a9 9 0 1 1-12.73 0" />
          <line x1="12" y1="2" x2="12" y2="12" />
        </svg>
      }
    >
      Logout
    </Button>
  )
}
