'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabaseClient'
import Input from './ui/Input'
import Button from './ui/Button'

export default function BookmarkForm() {
  const [title, setTitle] = useState('')
  const [url, setUrl] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const supabase = createClient()

  const validateUrl = (url: string) => {
    try {
      new URL(url)
      return true
    } catch (e) {
      return false
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!title.trim() || !url.trim()) {
      setError('Please provide both Title and URL')
      return
    }

    if (!validateUrl(url)) {
      setError('Please enter a valid URL')
      return
    }

    setLoading(true)

    try {
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        setError('You must be signed in for this action')
        return
      }

      const { error: insertError } = await supabase
        .from('bookmarks')
        .insert([{ title, url, user_id: user.id }])

      if (insertError) throw insertError

      setTitle('')
      setUrl('')
    } catch (err: any) {
      setError(`Error: ${err.message}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-5">
        <Input
          label="Bookmark Title"
          prefixCode="01"
          placeholder="e.g. My Favorite Recipes"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          disabled={loading}
        />
        <Input
          label="Source Link (URL)"
          prefixCode="02"
          placeholder="https://example.com"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          disabled={loading}
          error={error || undefined}
        />
      </div>
      
      <Button
        type="submit"
        className="w-full"
        isLoading={loading}
        rightIcon={
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 opacity-50 group-hover:translate-x-0.5 transition-transform" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        }
      >
        Save Bookmark
      </Button>
    </form>
  )
}
