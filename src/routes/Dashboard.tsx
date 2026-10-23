import { useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
} from 'recharts'
import { Download, Upload, AlertCircle, CheckCircle } from 'lucide-react'
import ReadinessGauge from '../components/ReadinessGauge'
import { topicById } from '../data/topics'
import { exportProgressJson, importProgressJson, loadProgress } from '../lib/progress'
import { computeReadiness, dailyTarget, weakestTopics } from '../lib/readiness'
import { useSettings } from '../hooks/useSettings'

export default function Dashboard() {
  const { settings, t } = useSettings()
  const [progressState, setProgressState] = useState(() => loadProgress())
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [importNotice, setImportNotice] = useState<{ type: 'success' | 'error'; msg: string } | null>(null)

  const { attempts } = progressState
  const r = computeReadiness(attempts)
  const target = dailyTarget(attempts.length, settings.examDate)

  // Accuracy per day for the progress line
  const byDay = new Map<string, { c: number; n: number }>()
  for (const a of attempts) {
    const d = new Date(a.at).toISOString().slice(0, 10)
    const cur = byDay.get(d) ?? { c: 0, n: 0 }
    byDay.set(d, { c: cur.c + (a.isCorrect ? 1 : 0), n: cur.n + 1 })
  }
  const line = [...byDay.entries()]
    .sort()
    .map(([day, v]) => ({ day: day.slice(5), accuracy: Math.round((v.c / v.n) * 100) }))

  const handleDownload = () => {
    const jsonStr = exportProgressJson()
    const blob = new Blob([jsonStr], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `mwalimu-cloud-progress-${new Date().toISOString().slice(0, 10)}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (event) => {
      const content = event.target?.result as string
      const result = importProgressJson(content)
      if (result.success) {
        setProgressState(loadProgress())
        setImportNotice({ type: 'success', msg: 'Progress restored and merged successfully!' })
      } else {
        setImportNotice({ type: 'error', msg: result.error ?? 'Failed to restore progress.' })
      }
      setTimeout(() => setImportNotice(null), 5000)
    }
    reader.readAsText(file)
    // Clear input so re-upload works
    e.target.value = ''
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-3xl font-bold">{t('dash.title')}</h1>
        <div className="flex items-center gap-2">
          <button
            onClick={handleDownload}
            className="btn-ghost flex items-center gap-1.5 text-xs font-semibold"
            title="Export your attempts and repetition cards as a JSON backup"
          >
            <Download size={15} /> {t('dash.export')}
          </button>
          <button
            onClick={() => fileInputRef.current?.click()}
            className="btn-ghost flex items-center gap-1.5 text-xs font-semibold"
            title="Restore a previously downloaded progress file"
          >
            <Upload size={15} /> {t('dash.import')}
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept=".json,application/json"
            onChange={handleFileUpload}
            className="sr-only"
            aria-label="Upload progress backup"
          />
        </div>
      </div>

      {importNotice && (
        <div
          role="status"
          className={`flex items-center gap-2 rounded-lg p-3 text-sm font-medium ${
            importNotice.type === 'success'
              ? 'border border-tide/30 bg-tide/10 text-ink'
              : 'border border-red-700/30 bg-red-50 text-red-800'
          }`}
        >
          {importNotice.type === 'success' ? <CheckCircle size={16} /> : <AlertCircle size={16} />}
          <span>{importNotice.msg}</span>
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-[auto_1fr]">
        <div className="panel flex flex-col items-center justify-center">
          <ReadinessGauge score={r.overall} label={r.label} />
          <p className="mt-2 max-w-[16rem] text-center text-xs text-ink/60">{t('dash.disclaimer')}</p>
        </div>
        <div className="panel">
          <h2 className="mb-2 text-lg font-bold">Accuracy by domain</h2>
          <div
            className="h-48"
            role="img"
            aria-label={r.domains.map((d) => `${d.title}: ${d.score}%`).join('. ')}
          >
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={r.domains.map((d) => ({ name: d.title.replace('Describe ', ''), score: d.score }))}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" tick={{ fontSize: 11 }} interval={0} />
                <YAxis domain={[0, 100]} width={30} />
                <Tooltip />
                <Bar dataKey="score" fill="#1B7F8C" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {target && (
        <div className="panel bg-sun/15 border-sun/40">
          <p className="text-sm">
            <strong>{target.days} days</strong> until your exam. Aim for about{' '}
            <strong>{target.perDay} practice questions</strong> a day to be prepared.
          </p>
        </div>
      )}

      <div className="panel">
        <h2 className="mb-2 text-lg font-bold">Progress over time</h2>
        {line.length < 2 ? (
          <p className="text-sm text-ink/70">Practise on two different days to see your trend curve.</p>
        ) : (
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={line}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="day" />
                <YAxis domain={[0, 100]} width={30} />
                <Tooltip />
                <Line dataKey="accuracy" stroke="#0E3B43" strokeWidth={2} dot />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      <div className="panel">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-lg font-bold">Your 5 weakest topics</h2>
          <Link to="/planner" className="text-xs text-tide underline hover:text-ink">
            View Study Planner →
          </Link>
        </div>
        <ul className="divide-y divide-ink/10">
          {weakestTopics(r.topics, 5).map((s) => (
            <li key={s.topicId} className="flex items-center justify-between gap-3 py-2.5">
              <span>
                {topicById(s.topicId)?.title}{' '}
                <span className="text-xs text-ink/60">
                  ({s.attempts ? Math.round(s.accuracy * 100) + '%' : t('status.not_started')})
                </span>
              </span>
              <Link className="btn-ghost shrink-0 text-xs font-semibold" to={`/quiz?topic=${s.topicId}`}>
                Practise now
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
