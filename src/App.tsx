import { lazy, Suspense } from 'react'
import { Link, NavLink, Navigate, Route, Routes } from 'react-router-dom'
import { Cloud } from 'lucide-react'
import DisclaimerFooter from './components/DisclaimerFooter'
import { useAuth } from './hooks/useAuth'
import { useSettings } from './hooks/useSettings'

const Home = lazy(() => import('./routes/Home'))
const Onboarding = lazy(() => import('./routes/Onboarding'))
const Topics = lazy(() => import('./routes/Topics'))
const Explain = lazy(() => import('./routes/Explain'))
const Quiz = lazy(() => import('./routes/Quiz'))
const Revision = lazy(() => import('./routes/Revision'))
const Dashboard = lazy(() => import('./routes/Dashboard'))

export default function App() {
  const auth = useAuth()
  const { settings, t } = useSettings()
  const link = ({ isActive }: { isActive: boolean }) => `rounded-md px-3 py-1.5 text-sm font-semibold ${isActive ? 'bg-ink text-white' : 'hover:bg-mist'}`

  if (auth.loading) return <p className="p-8 text-center">Loading…</p>

  const guard = (el: JSX.Element) => (!auth.ready ? <Navigate to="/" replace /> : !settings.onboarded ? <Navigate to="/onboarding" replace /> : el)

  return (
    <div className="mx-auto flex min-h-screen max-w-4xl flex-col px-4">
      <header className="flex flex-wrap items-center justify-between gap-3 py-4">
        <Link to="/" className="flex items-center gap-2 font-display text-xl font-bold"><Cloud aria-hidden /> Mwalimu Cloud</Link>
        {auth.ready && (
          <nav className="flex items-center gap-1" aria-label="Main">
            <NavLink to="/topics" className={link}>{t('nav.topics')}</NavLink>
            <NavLink to="/revision" className={link}>{t('nav.revision')}</NavLink>
            <NavLink to="/dashboard" className={link}>{t('nav.dashboard')}</NavLink>
            <button className="ml-2 text-sm underline" onClick={auth.signOut}>{auth.session ? 'Sign out' : 'Exit guest'}</button>
          </nav>
        )}
      </header>
      <main className="flex-1">
        <Suspense fallback={<div className="panel animate-pulse py-16" aria-busy />}>
          <Routes>
            <Route path="/" element={auth.ready && settings.onboarded ? <Navigate to="/topics" replace /> : <Home auth={auth} />} />
            <Route path="/onboarding" element={auth.ready ? <Onboarding /> : <Navigate to="/" replace />} />
            <Route path="/topics" element={guard(<Topics />)} />
            <Route path="/explain/:topicId" element={guard(<Explain />)} />
            <Route path="/quiz" element={guard(<Quiz />)} />
            <Route path="/revision" element={guard(<Revision />)} />
            <Route path="/dashboard" element={guard(<Dashboard />)} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </main>
      <DisclaimerFooter />
    </div>
  )
}
