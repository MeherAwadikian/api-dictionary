import { useState, useEffect, useCallback } from 'react'
import { supabase, getSessionId } from '../lib/supabase'

const LOCAL_KEY = 'api-dictionary-favorites'

function loadLocal(): Set<string> {
  try {
    const raw = localStorage.getItem(LOCAL_KEY)
    return raw ? new Set(JSON.parse(raw)) : new Set()
  } catch {
    return new Set()
  }
}

function saveLocal(set: Set<string>) {
  localStorage.setItem(LOCAL_KEY, JSON.stringify([...set]))
}

export function useFavorites() {
  const [favorites, setFavorites] = useState<Set<string>>(loadLocal)
  const [synced,    setSynced]    = useState(false)

  // try to sync from Supabase — silently skip if favorites table doesn't exist yet
  useEffect(() => {
    const sessionId = getSessionId()
    supabase
      .from('favorites')
      .select('api_key')
      .eq('session_id', sessionId)
      .then(({ data, error }) => {
        if (error || !data) { setSynced(true); return }
        setFavorites(prev => {
          const merged = new Set([...prev, ...data.map((r: { api_key: string }) => r.api_key)])
          saveLocal(merged)
          return merged
        })
        setSynced(true)
      })
  }, [])

  const toggle = useCallback(async (key: string) => {
    const sessionId = getSessionId()
    let removing = false
    setFavorites(prev => {
      const next = new Set(prev)
      if (next.has(key)) { next.delete(key); removing = true }
      else next.add(key)
      saveLocal(next)
      return next
    })

    // best-effort Supabase sync — ignore errors if table missing
    if (removing) {
      await supabase.from('favorites').delete().eq('session_id', sessionId).eq('api_key', key)
    } else {
      await supabase.from('favorites').insert({ session_id: sessionId, api_key: key })
    }
  }, [])

  const isFavorite = useCallback((key: string) => favorites.has(key), [favorites])

  return { favorites, toggle, isFavorite, synced }
}
