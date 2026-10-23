import { useEffect, useState } from 'react'
import type { Session } from '@supabase/supabase-js'
import { supabase } from '../lib/supabase'

const GUEST_KEY = 'mwalimu.guest'

/** Session state plus guest mode. `ready` = signed in or guest. */
export function useAuth() {
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)
  const [guest, setGuest] = useState(() => localStorage.getItem(GUEST_KEY) === '1')

  useEffect(() => {
    if (!supabase) { setLoading(false); return }
    supabase.auth.getSession().then(({ data }) => { setSession(data.session); setLoading(false) })
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => setSession(s))
    return () => sub.subscription.unsubscribe()
  }, [])

  const continueAsGuest = () => { localStorage.setItem(GUEST_KEY, '1'); setGuest(true) }
  const signOut = async () => { await supabase?.auth.signOut(); localStorage.removeItem(GUEST_KEY); setGuest(false) }
  return { session, loading, guest, ready: !!session || guest, continueAsGuest, signOut }
}
