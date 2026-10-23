import { useState } from 'react'
import { Bus, CheckCircle2, ShieldCheck, Zap } from 'lucide-react'
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
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: window.location.origin },
    })
    setBusy(false)
    setMsg(error ? 'Could not send the link. Check the address and retry.' : t('home.sent'))
  }

  return (
    <div className="grid gap-8 py-6 md:grid-cols-2 md:items-center">
      <div>
        <h1 className="text-4xl font-bold leading-tight md:text-5xl">{t('home.title')}</h1>
        <p className="mt-4 max-w-prose text-lg text-ink/80">{t('home.sub')}</p>

        <div className="mt-6 max-w-sm space-y-3">
          {hasBackend ? (
            <>
              <div>
                <label className="block text-sm font-semibold" htmlFor="email">
                  {t('home.email')}
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-ink/20 px-3 py-2.5"
                  placeholder="you@example.com"
                />
              </div>
              <button
                className="btn-primary w-full"
                disabled={!email || busy}
                onClick={send}
              >
                {t('home.send')}
              </button>
              <div className="relative my-2 text-center text-xs text-ink/50">
                <span className="bg-paper px-2">or</span>
              </div>
            </>
          ) : (
            <div className="rounded-lg border border-tide/20 bg-mist/60 p-3 text-sm text-ink/85">
              <p className="flex items-center gap-1.5 font-semibold text-tide">
                <ShieldCheck size={16} /> Guest Mode Ready
              </p>
              <p className="mt-1 text-xs text-ink/70">
                No sign-in or API keys required. All progress stays safely in your browser.
              </p>
            </div>
          )}

          <button className="btn-accent w-full text-base font-bold" onClick={auth.continueAsGuest}>
            {t('home.guest')}
          </button>
          {msg && <p role="status" className="text-sm">{msg}</p>}
        </div>

        <ul className="mt-6 space-y-1.5 text-xs text-ink/70">
          <li className="flex items-center gap-1.5">
            <CheckCircle2 size={14} className="text-tide" /> 120+ original, scenario-based practice questions
          </li>
          <li className="flex items-center gap-1.5">
            <CheckCircle2 size={14} className="text-tide" /> African analogies (matatus, M-Pesa kiosks, tokens, SACCOs)
          </li>
          <li className="flex items-center gap-1.5">
            <CheckCircle2 size={14} className="text-tide" /> Leitner spaced repetition to conquer weak areas
          </li>
          <li className="flex items-center gap-1.5">
            <Zap size={14} className="text-sun" /> 100% offline-ready on mobile phones
          </li>
        </ul>
      </div>

      <aside className="rounded-2xl bg-ink p-6 text-white shadow-sm" aria-label="Example analogy">
        <Bus aria-hidden className="mb-3 text-sun" size={36} />
        <p className="font-display text-2xl leading-snug">
          Scalability is a matatu route adding vehicles at rush hour and parking them at midday.
        </p>
        <p className="mt-4 text-white/80">
          In Azure, that means automatically adding compute capacity when customer traffic spikes and removing it when
          demand subsides, ensuring you pay only for what you actively use.
        </p>
        <div className="mt-6 rounded-lg border border-white/10 bg-white/5 p-3 text-xs text-white/70">
          <strong>Accuracy first:</strong> Analogies complement official definitions, never replace them.
        </div>
      </aside>
    </div>
  )
}
