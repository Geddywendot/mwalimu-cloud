import { Link } from 'react-router-dom'
import { useSettings } from '../hooks/useSettings'
import type { TopicStat } from '../lib/readiness'
import type { Topic } from '../types'

const badge = { not_started: 'bg-mist text-ink/70', learning: 'bg-sun/30 text-ink', strong: 'bg-tide text-white' }

export default function TopicCard({ topic, stat }: { topic: Topic; stat: TopicStat }) {
  const { t } = useSettings()
  const pct = Math.round(stat.accuracy * 100)
  return (
    <Link to={`/explain/${topic.id}`} className="panel block transition-shadow hover:shadow-md" aria-label={`${topic.title}. ${t('status.' + stat.status)}, ${pct}% mastery`}>
      <div className="flex items-start justify-between gap-3">
        <h3 className="text-lg font-semibold leading-snug">{topic.title}</h3>
        <span className={`shrink-0 rounded-full px-2.5 py-0.5 text-xs font-semibold ${badge[stat.status]}`}>{t('status.' + stat.status)}</span>
      </div>
      <p className="mt-1 text-sm text-ink/70">{topic.description}</p>
      <div className="mt-4 h-2 overflow-hidden rounded-full bg-mist" role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100}>
        <div className="h-full rounded-full bg-tide" style={{ width: `${pct}%` }} />
      </div>
      <p className="mt-1 text-xs text-ink/60">{pct}%</p>
    </Link>
  )
}
