'use client'

import { useEffect, useState, useCallback, useMemo } from 'react'
import { createClient } from '@/lib/supabaseClient'
import { Bookmark } from '@/lib/types'
import DeleteConfirmModal from './DeleteConfirmModal'

export default function BookmarkList() {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const supabase = useMemo(() => createClient(), [])
  const [deleteTarget, setDeleteTarget] = useState<Bookmark | null>(null)

  const fetchBookmarks = useCallback(async () => {
    try {
      setError(null)
      const { data, error } = await supabase
        .from('bookmarks')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      setBookmarks(data || [])
    } catch (err: any) {
      console.error('Fetch error:', err.message)
      setError('Could not sync with repository. Retrying...')
    } finally {
      setLoading(false)
    }
  }, [supabase])

  useEffect(() => {
    let isMounted = true
    let retryCount = 0
    const maxRetries = 3
    let activeChannel: any = null

    const setupSubscription = async () => {
      // Ensure we have a session before subscribing
      const { data: { session } } = await supabase.auth.getSession()
      
      if (!session && isMounted) {
        console.warn('Real-time: No active session found. Auth context might be initializing...')
        if (retryCount < maxRetries) {
          retryCount++
          setTimeout(setupSubscription, 2000)
        }
        return
      }

      if (!isMounted) return
      fetchBookmarks()
      
      // Small delay to ensure client hydration is complete
      await new Promise(resolve => setTimeout(resolve, 500))
      
      if (!isMounted) return

      const channel = supabase
        .channel('bookmarks-realtime')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'bookmarks',
          },
          (payload) => {
            if (!isMounted) return
            
            if (payload.eventType === 'INSERT') {
              const newBookmark = payload.new as Bookmark
              setBookmarks(prev => {
                if (prev.some(b => b.id === newBookmark.id)) return prev
                return [newBookmark, ...prev]
              })
            } else if (payload.eventType === 'DELETE') {
              setBookmarks(prev => prev.filter(b => b.id !== payload.old.id))
            } else if (payload.eventType === 'UPDATE') {
              const updatedBookmark = payload.new as Bookmark
              setBookmarks(prev => prev.map(b => b.id === updatedBookmark.id ? updatedBookmark : b))
            }
          }
        )
        .subscribe((status, err) => {
          if (!isMounted) return
          
          if (status === 'SUBSCRIBED') {
            retryCount = 0
            setError(null)
          }
          
          if (status === 'TIMED_OUT' || status === 'CHANNEL_ERROR') {
            console.warn('Real-time sync issue:', status, err)
            if (retryCount < maxRetries) {
              retryCount++
              console.log(`Retrying subscription (${retryCount}/${maxRetries})...`)
              setTimeout(setupSubscription, 2000)
            } else {
              setError('Real-time connection failed. Please ensure your database has the "bookmarks" table added to the "supabase_realtime" publication.')
            }
          }
        })

      activeChannel = channel
    }

    setupSubscription()

    return () => {
      isMounted = false
      if (activeChannel) {
        supabase.removeChannel(activeChannel)
      }
    }
  }, [supabase, fetchBookmarks])

  const handleDelete = async () => {
    if (!deleteTarget) return
    
    const targetId = deleteTarget.id
    const previousBookmarks = [...bookmarks]
    
    // Optimistic UI update
    setBookmarks(prev => prev.filter(b => b.id !== targetId))
    setDeleteTarget(null)

    try {
      const { error } = await supabase.from('bookmarks').delete().eq('id', targetId)
      if (error) throw error
    } catch (err: any) {
      setBookmarks(previousBookmarks)
      alert(`Deletion failed: ${err.message}`)
    }
  }

  const getFaviconUrl = (url: string) => {
    try {
      const hostname = new URL(url).hostname
      // Don't call Google's favicon service for localhost or internal IPs to avoid 404s in console
      if (hostname === 'localhost' || hostname === '127.0.0.1' || hostname.startsWith('192.168.')) {
        return null
      }
      return `https://www.google.com/s2/favicons?sz=64&domain=${hostname}`
    } catch {
      return null
    }
  }

  if (loading) return (
    <div className="space-y-4">
      {[1, 2, 3].map((i) => (
        <div key={i} className="h-20 w-full bg-secondary/50 border border-border rounded-2xl animate-pulse" />
      ))}
    </div>
  )

  if (error && bookmarks.length === 0) {
    return (
      <div className="h-40 flex flex-col items-center justify-center border border-red-500/20 rounded-3xl bg-red-500/5 p-6 text-center">
        <span className="text-[10px] font-mono font-bold text-red-500 uppercase tracking-widest mb-2">Sync Error</span>
        <p className="text-xs text-muted max-w-xs">{error}</p>
        <button onClick={() => fetchBookmarks()} className="mt-4 text-[10px] font-bold text-accent uppercase hover:underline">Reinitialize</button>
      </div>
    )
  }

  if (bookmarks.length === 0) {
    return (
      <div className="h-40 flex flex-col items-center justify-center border border-dashed border-border rounded-3xl bg-secondary/30">
        <span className="text-[10px] font-mono font-bold text-muted uppercase tracking-widest text-center px-6">Repository Empty // No assets detected</span>
      </div>
    )
  }

  const FALLBACK_ICON = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9ImN1cnJlbnRDb2xvciIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiPjxwYXRoIGQ9Ik0xMCAxM2ExIDUgMCAwIDAgNSAwIi8+PHBhdGggZD0iTTEwIDEzYTEgNSAwIDAgMSA1IDAiLz48L3N2Zz4=';

  return (
    <>
      <div className="grid grid-cols-1 gap-4">
        {bookmarks.map((bookmark) => {
          const faviconUrl = getFaviconUrl(bookmark.url)
          
          return (
            <div
              key={bookmark.id}
              className="group flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 p-5 bg-background border border-border rounded-2xl hover:border-accent/30 hover:bg-secondary/50 transition-all card-shine relative"
            >
              {/* Favicon / Status */}
              <div className="w-10 h-10 rounded-lg bg-secondary border border-border flex items-center justify-center shrink-0 group-hover:border-accent transition-colors">
                <img 
                  src={faviconUrl || FALLBACK_ICON} 
                  alt=""
                  loading="lazy"
                  className="w-5 h-5 rounded-sm grayscale group-hover:grayscale-0 transition-all opacity-50 group-hover:opacity-100"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = FALLBACK_ICON;
                  }}
                />
              </div>

            <div className="flex-1 min-w-0 w-full sm:w-auto">
              <div className="flex items-center justify-between sm:justify-start gap-3 mb-1">
                <h3 className="text-sm font-bold text-foreground truncate uppercase tracking-tight">
                  {bookmark.title}
                </h3>
                <span className="text-[9px] font-mono text-muted uppercase tracking-widest shrink-0">
                  {new Date(bookmark.created_at).toLocaleDateString()}
                </span>
              </div>
              <a
                href={bookmark.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[10px] font-mono text-muted hover:text-accent transition-colors flex items-center gap-1.5 truncate"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                  <polyline points="15 3 21 3 21 9" />
                  <line x1="10" y1="14" x2="21" y2="3" />
                </svg>
                {bookmark.url}
              </a>
            </div>

            <button
              onClick={() => setDeleteTarget(bookmark)}
              className="absolute top-4 right-4 sm:relative sm:top-auto sm:right-auto w-8 h-8 rounded-lg flex items-center justify-center text-muted hover:text-red-500 hover:bg-red-500/10 transition-all opacity-0 group-hover:opacity-100"
              title="Delete asset"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            </div>
          )
        })}
      </div>

      <DeleteConfirmModal 
        isOpen={!!deleteTarget}
        title={deleteTarget?.title || ''}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
      />
    </>
  )
}
