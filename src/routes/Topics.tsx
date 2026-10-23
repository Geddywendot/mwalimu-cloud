import { Link } from 'react-router-dom'
import TopicCard from '../components/TopicCard'
import { DOMAINS, topicsInDomain } from '../data/topics'
import { loadProgress } from '../lib/progress'
import { computeReadiness } from '../lib/readiness'
import { useSettings } from '../hooks/useSettings'

export default function Topics() {
  const { t } = useSettings()
  const r = computeReadiness(loadProgress().attempts)
  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-3xl">{t('topics.title')}</h1>
        <Link to="/quiz?topic=mixed" className="btn-accent">Mixed quiz, weak areas first</Link>
      </div>
      {DOMAINS.map((d) => (
        <section key={d.id} className="mb-8" aria-labelledby={`d-${d.id}`}>
          <h2 id={`d-${d.id}`} className="mb-3 text-xl">{d.title}</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {topicsInDomain(d.id).map((topic) => (
              <TopicCard key={topic.id} topic={topic} stat={r.topics.find((s) => s.topicId === topic.id)!} />
            ))}
          </div>
        </section>
      ))}
    </div>
  )
}
