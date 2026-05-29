import { createClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL as string
const key = import.meta.env.VITE_SUPABASE_ANON_KEY as string

// Strip x-client-info so Supabase doesn't detect the service key as a browser request
export const supabase = createClient(url, key, {
  global: {
    fetch: (input, init) => {
      const h = new Headers((init?.headers as HeadersInit) ?? {})
      h.delete('x-client-info')
      return fetch(input, { ...init, headers: h })
    },
  },
})

export function getSessionId(): string {
  const STORAGE_KEY = 'api-dictionary-session'
  let id = localStorage.getItem(STORAGE_KEY)
  if (!id) {
    id = crypto.randomUUID()
    localStorage.setItem(STORAGE_KEY, id)
  }
  return id
}
