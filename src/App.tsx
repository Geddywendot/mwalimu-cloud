import { Suspense } from 'react'
import { Link, NavLink, Navigate, Route, Routes } from 'react-router-dom'
import { Cloud } from 'lucide-react'
import DisclaimerFooter from './components/DisclaimerFooter'
import HonestyBadges from './components/HonestyBadges'
import { useAuth } from './hooks/useAuth'
import { useSettings } from './hooks/useSettings'
import { LANGUAGES, saveSettings } from './lib/settings'

import Home from './routes/Home'
import Onboarding from './routes/Onboarding'
import Topics from './routes/Topics'
import Explain from './routes/Explain'
import Quiz from './routes/Quiz'
import Revision from './routes/Revision'
import Dashboard from './routes/Dashboard'
import Planner from './routes/Planner'
import About from './routes/About'

export default function App() {
  const auth = useAuth()
  const { settings, t } = useSettings()

  const link = ({ isActive }: { isActive: boolean }) =>
    `rounded-md px-3 py-1.5 text-sm font-semibold transition-colors ${
      isActive ? 'bg-ink text-white' : 'hover:bg-mist text-ink'
    }`

  if (auth.loading) return <p className="p-8 text-center text-ink/70">Loading…</p>

  const guard = (el: JSX.Element) =>
    !auth.ready ? (
      <Navigate to="/" replace />
    ) : !settings.onboarded ? (
      <Navigate to="/onboarding" replace />
    ) : (
      el
    )

  return (
    <div className="mx-auto flex min-h-screen max-w-4xl flex-col px-4">
      <header className="flex flex-wrap items-center justify-between gap-3 py-4">
        <div className="flex items-center gap-3">
          <Link to="/" className="flex items-center gap-2 font-display text-xl font-bold text-ink">
            <Cloud aria-hidden /> Mwalimu Cloud
          </Link>
          <HonestyBadges />
        </div>

        {auth.ready && (
          <nav className="flex flex-wrap items-center gap-1" aria-label="Main">
            <NavLink to="/topics" className={link}>
              {t('nav.topics')}
            </NavLink>
            <NavLink to="/revision" className={link}>
              {t('nav.revision')}
            </NavLink>
            <NavLink to="/planner" className={link}>
              {t('nav.planner')}
            </NavLink>
            <NavLink to="/dashboard" className={link}>
              {t('nav.dashboard')}
            </NavLink>
            {settings.onboarded && (
              <label className="ml-2 flex items-center gap-2 text-sm">
                <span className="sr-only">{t('language.label')}</span>
                <select
                  aria-label={t('language.label')}
                  value={settings.language}
                  onChange={(event) => {
                    void saveSettings({ ...settings, language: event.currentTarget.value })
                  }}
                  className="rounded-md border border-ink/20 bg-white px-2 py-1.5 font-semibold text-ink"
                >
                  {LANGUAGES.map((language) => (
                    <option key={language.code} value={language.code}>
                      {language.label}
                    </option>
                  ))}
                </select>
              </label>
            )}
            <button className="ml-2 text-sm text-ink/75 underline hover:text-ink" onClick={auth.signOut}>
              {auth.session ? 'Sign out' : 'Exit guest'}
            </button>
          </nav>
        )}
      </header>

      <main className="flex-1">
        <Suspense fallback={<div className="panel animate-pulse py-16" aria-busy />}>
          <Routes>
            <Route
              path="/"
              element={
                auth.ready && settings.onboarded ? <Navigate to="/topics" replace /> : <Home auth={auth} />
              }
            />
            <Route path="/onboarding" element={auth.ready ? <Onboarding /> : <Navigate to="/" replace />} />
            <Route path="/topics" element={guard(<Topics />)} />
            <Route path="/explain/:topicId" element={guard(<Explain />)} />
            <Route path="/quiz" element={guard(<Quiz />)} />
            <Route path="/revision" element={guard(<Revision />)} />
            <Route path="/planner" element={guard(<Planner />)} />
            <Route path="/dashboard" element={guard(<Dashboard />)} />
            <Route path="/about" element={<About />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </main>

      <DisclaimerFooter />
    </div>
  )
}
