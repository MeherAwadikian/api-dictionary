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

    setChecking(true)
    supabase
      .from('user_profiles')
      .select('trial_start, paid')
      .eq('id', user.id)
      .single()
      .then(({ data, error }) => {
        if (error || !data) {
          setHasAccess(false)
          setChecking(false)
          return
        }

        if (data.paid) {
          setHasAccess(true)
          setPaid(true)
          setChecking(false)
          return
        }

        const diffDays = (Date.now() - new Date(data.trial_start).getTime()) / 86_400_000
        const left     = Math.max(0, TRIAL_DAYS - diffDays)
        setTrialDaysLeft(Math.ceil(left))
        setHasAccess(left > 0)
        setChecking(false)
      })
  }, [user, tick])

  return { hasAccess, trialDaysLeft, paid, checking, refresh: () => setTick(t => t + 1) }
}
