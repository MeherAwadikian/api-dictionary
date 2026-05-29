import { useState, useEffect } from 'react'
import type { User } from '@supabase/supabase-js'
import { supabase } from '../lib/supabase'

const FREE_EMAILS = ['krikormher@gmail.com']
const TRIAL_DAYS  = 7

export type AccessState = {
  hasAccess:     boolean
  trialDaysLeft: number
  paid:          boolean
  checking:      boolean
  refresh:       () => void
}

export function useAccess(user: User | null): AccessState {
  const [hasAccess,     setHasAccess]     = useState(false)
  const [trialDaysLeft, setTrialDaysLeft] = useState(TRIAL_DAYS)
  const [paid,          setPaid]          = useState(false)
  const [checking,      setChecking]      = useState(true)
  const [tick,          setTick]          = useState(0)

  useEffect(() => {
    if (!user) {
      setHasAccess(false)
      setChecking(false)
      return
    }

    // hardcoded free account
    if (FREE_EMAILS.includes(user.email ?? '')) {
      setHasAccess(true)
      setPaid(true)
      setChecking(false)
      return
    }

    const meta = (user.user_metadata ?? {}) as Record<string, unknown>

    // already paid
    if (meta.paid === true) {
      setHasAccess(true)
      setPaid(true)
      setChecking(false)
      return
    }

    // first login — stamp trial_start into user metadata
    if (!meta.trial_start) {
      supabase.auth
        .updateUser({ data: { trial_start: new Date().toISOString(), paid: false } })
        .then(() => {
          setTrialDaysLeft(TRIAL_DAYS)
          setHasAccess(true)
          setChecking(false)
        })
      return
    }

    // check remaining trial days
    const diffDays = (Date.now() - new Date(meta.trial_start as string).getTime()) / 86_400_000
    const left     = Math.max(0, TRIAL_DAYS - diffDays)
    setTrialDaysLeft(Math.ceil(left))
    setHasAccess(left > 0)
    setChecking(false)
  }, [user, tick])

  return { hasAccess, trialDaysLeft, paid, checking, refresh: () => setTick(t => t + 1) }
}
