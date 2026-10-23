import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useMutation } from '@tanstack/react-query'
import QuizRunner from '../components/QuizRunner'
import { DOMAINS, TOPICS } from '../data/topics'
import { fetchQuiz } from '../lib/api'
import { loadProgress } from '../lib/progress'
import { computeReadiness, weakestTopics } from '../lib/readiness'
import { useSettings } from '../hooks/useSettings'
import type { Question } from '../types'

export default function Quiz() {
  const [params] = useSearchParams()
  const { settings } = useSettings()
  const [topic, setTopic] = useState(params.get('topic') ?? 'mixed')
  const [count, setCount] = useState<5 | 10>(5)
  const [run, setRun] = useState<{ questions: Question[]; notice?: string } | null>(null)

  const start = useMutation({
    mutationFn: () => {
      const ids = topic === 'mixed'
        ? weakestTopics(computeReadiness(loadProgress().attempts).topics, 3).map((s) => s.topicId)
        : [topic]
      return fetchQuiz(ids, count, settings.language)
    },
    onSuccess: setRun,
  })

  if (run) return (<div className="space-y-3">{run.notice && <p className="rounded-lg bg-sun/30 p-3 text-sm" role="status">{run.notice}</p>}<QuizRunner questions={run.questions} /></div>)

  return (
    <div className="panel mx-auto max-w-md space-y-5">
      <h1 className="text-2xl">Start a quiz</h1>
      <div>
        <label htmlFor="topic" className="mb-1 block font-semibold">Topic</label>
        <select id="topic" value={topic} onChange={(e) => setTopic(e.target.value)} className="w-full rounded-lg border border-ink/20 px-3 py-2.5">
          <option value="mixed">Mixed (weak areas first)</option>
          {DOMAINS.map((d) => (
            <optgroup key={d.id} label={d.title}>
              {TOPICS.filter((t) => t.domainId === d.id).map((t) => <option key={t.id} value={t.id}>{t.title}</option>)}
            </optgroup>
          ))}
        </select>
      </div>
      <fieldset>
        <legend className="mb-1 font-semibold">Questions</legend>
        <div className="flex gap-3">
          {[5, 10].map((n) => (
            <label key={n} className={`btn-ghost cursor-pointer ${count === n ? '!bg-ink !text-white' : ''}`}>
              <input type="radio" className="sr-only" name="count" checked={count === n} onChange={() => setCount(n as 5 | 10)} /> {n}
            </label>
          ))}
        </div>
      </fieldset>
      <button className="btn-primary w-full" disabled={start.isPending} onClick={() => start.mutate()}>{start.isPending ? 'Writing your questions…' : 'Start quiz'}</button>
      {start.isError && <p role="alert" className="text-sm text-red-700">{(start.error as Error).message} <button className="underline" onClick={() => start.mutate()}>Retry</button></p>}
    </div>
  )
}
