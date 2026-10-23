import { useState } from 'react'
import { Bus } from 'lucide-react'
import { hasBackend, supabase } from '../lib/supabase'
import { useSettings } from '../hooks/useSettings'
import type { useAuth } from '../hooks/useAuth'

export default function Home({ auth }: { auth: ReturnType<typeof useAuth> }) {
  const { t } = useSettings()
  const [email, setEmail] = useState('')
  const [msg, setMsg] = useState('')
  const [busy, setBusy] = useState(false)

  const send = async () => {
    if (!supabase) return setMsg('Sign-in needs a Supabase backend. You can continue as a guest.')
    setBusy(true)
    const { error } = await supabase.auth.signInWithOtp({ email, options: { emailRedirectTo: window.location.origin } })
    setBusy(false)
    setMsg(error ? 'Could not send the link. Check the address and retry.' : t('home.sent'))
  }

  return (
    <div className="grid gap-8 py-6 md:grid-cols-2 md:items-center">
      <div>
        <h1 className="text-4xl font-bold leading-tight md:text-5xl">{t('home.title')}</h1>
        <p className="mt-4 max-w-prose text-lg text-ink/80">{t('home.sub')}</p>
        <div className="mt-6 max-w-sm space-y-3">
          <label className="block text-sm font-semibold" htmlFor="email">{t('home.email')}</label>
          <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full rounded-lg border border-ink/20 px-3 py-2.5" placeholder="you@example.com" />
          <button className="btn-primary w-full" disabled={!email || busy || !hasBackend} onClick={send}>{t('home.send')}</button>
          <button className="btn-ghost w-full" onClick={auth.continueAsGuest}>{t('home.guest')}</button>
          {msg && <p role="status" className="text-sm">{msg}</p>}
        </div>
      </div>
      <aside className="rounded-2xl bg-ink p-6 text-white" aria-label="Example analogy">
        <Bus aria-hidden className="mb-3 text-sun" size={32} />
        <p className="font-display text-2xl leading-snug">Scalability is a matatu route adding vehicles at rush hour and sending them home at midday.</p>
        <p className="mt-4 text-white/80">In Azure, that means adding resources when demand rises and removing them when it falls, so you only pay for what you use.</p>
      </aside>
    </div>
  )
}
