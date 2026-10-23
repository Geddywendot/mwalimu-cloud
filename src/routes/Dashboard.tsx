import { Link } from 'react-router-dom'
import { Bar, BarChart, CartesianGrid, Line, LineChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from 'recharts'
import ReadinessGauge from '../components/ReadinessGauge'
import { topicById } from '../data/topics'
import { loadProgress } from '../lib/progress'
import { computeReadiness, dailyTarget, weakestTopics } from '../lib/readiness'
import { useSettings } from '../hooks/useSettings'

export default function Dashboard() {
  const { settings, t } = useSettings()
  const { attempts } = loadProgress()
  const r = computeReadiness(attempts)
  const target = dailyTarget(attempts.length, settings.examDate)

  // Accuracy per day for the progress line
  const byDay = new Map<string, { c: number; n: number }>()
  for (const a of attempts) {
    const d = new Date(a.at).toISOString().slice(0, 10)
    const cur = byDay.get(d) ?? { c: 0, n: 0 }
    byDay.set(d, { c: cur.c + (a.isCorrect ? 1 : 0), n: cur.n + 1 })
  }
  const line = [...byDay.entries()].sort().map(([day, v]) => ({ day: day.slice(5), accuracy: Math.round((v.c / v.n) * 100) }))

  return (
    <div className="space-y-6">
      <h1 className="text-3xl">{t('dash.title')}</h1>
      <div className="grid gap-4 md:grid-cols-[auto_1fr]">
        <div className="panel flex flex-col items-center justify-center">
          <ReadinessGauge score={r.overall} label={r.label} />
          <p className="mt-2 max-w-[16rem] text-center text-xs text-ink/60">{t('dash.disclaimer')}</p>
        </div>
        <div className="panel">
          <h2 className="mb-2 text-lg">Accuracy by domain</h2>
          <div className="h-48" role="img" aria-label={r.domains.map((d) => `${d.title}: ${d.score}%`).join('. ')}>
            <ResponsiveContainer>
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
        <div className="panel bg-sun/15"><p><strong>{target.days} days</strong> until your exam. Aim for about <strong>{target.perDay} questions a day</strong>.</p></div>
      )}

      <div className="panel">
        <h2 className="mb-2 text-lg">Progress over time</h2>
        {line.length < 2 ? <p className="text-ink/70">Practise on two different days to see your trend.</p> : (
          <div className="h-48"><ResponsiveContainer><LineChart data={line}><CartesianGrid strokeDasharray="3 3" vertical={false} /><XAxis dataKey="day" /><YAxis domain={[0, 100]} width={30} /><Tooltip /><Line dataKey="accuracy" stroke="#0E3B43" strokeWidth={2} dot /></LineChart></ResponsiveContainer></div>
        )}
      </div>

      <div className="panel">
        <h2 className="mb-3 text-lg">Your 5 weakest topics</h2>
        <ul className="divide-y divide-ink/10">
          {weakestTopics(r.topics, 5).map((s) => (
            <li key={s.topicId} className="flex items-center justify-between gap-3 py-2">
              <span>{topicById(s.topicId)?.title} <span className="text-sm text-ink/60">({s.attempts ? Math.round(s.accuracy * 100) + '%' : t('status.not_started')})</span></span>
              <Link className="btn-ghost shrink-0 text-sm" to={`/quiz?topic=${s.topicId}`}>Practise now</Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
