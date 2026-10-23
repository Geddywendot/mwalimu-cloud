import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import ExplanationCard from '../components/ExplanationCard'
import { askFollowup, fetchExplanation } from '../lib/api'
import { topicById } from '../data/topics'
import { useSettings } from '../hooks/useSettings'

const MAX_FOLLOWUPS = 5

export default function Explain() {
  const { topicId = '' } = useParams()
  const topic = topicById(topicId)
  const { settings, t } = useSettings()
  const [simpler, setSimpler] = useState(false)
  const q = useQuery({ queryKey: ['explain', topicId, settings.language, simpler], queryFn: () => fetchExplanation(topicId, settings.language, simpler), enabled: !!topic })

  const [question, setQuestion] = useState('')
  const [chat, setChat] = useState<{ q: string; a: string }[]>([])
  const [asking, setAsking] = useState(false)
  const [chatError, setChatError] = useState('')

  if (!topic) return <p>Topic not found. <Link className="underline" to="/topics">Back to topics</Link></p>

  const ask = async () => {
    setAsking(true); setChatError('')
    try {
      const r = await askFollowup(topicId, question, settings.language)
      setChat((c) => [...c, { q: question, a: r.answer }])
      setQuestion('')
    } catch (e) { setChatError(e instanceof Error ? e.message : 'Could not answer. Retry.') }
    setAsking(false)
  }

  return (
    <div className="space-y-5">
      <div>
        <Link to="/topics" className="text-sm underline">← All topics</Link>
        <h1 className="mt-1 text-3xl">{topic.title}</h1>
      </div>
      <div className="flex flex-wrap gap-3">
        <label className="flex items-center gap-2 font-semibold"><input type="checkbox" checked={simpler} onChange={(e) => setSimpler(e.target.checked)} /> {t('explain.simpler')}</label>
        <Link to={`/quiz?topic=${topicId}`} className="btn-accent ml-auto">{t('explain.quiz')}</Link>
      </div>

      {q.isLoading && <div className="panel animate-pulse space-y-3" aria-busy><div className="h-5 w-1/3 rounded bg-mist" /><div className="h-4 rounded bg-mist" /><div className="h-4 w-5/6 rounded bg-mist" /></div>}
      {q.isError && (
        <div className="panel border-red-700/40" role="alert">
          <p>{(q.error as Error).message}</p>
          <button className="btn-primary mt-3" onClick={() => q.refetch()}>Retry</button>
        </div>
      )}
      {q.data && <ExplanationCard e={q.data} />}

      <section className="panel" aria-labelledby="ask">
        <h2 id="ask" className="mb-3 text-xl">{t('explain.ask')} ({MAX_FOLLOWUPS - chat.length} left)</h2>
        {chat.map((m, i) => (<div key={i} className="mb-3"><p className="font-semibold">{m.q}</p><p className="mt-1 whitespace-pre-line text-ink/85">{m.a}</p></div>))}
        {chat.length < MAX_FOLLOWUPS ? (
          <div className="flex gap-2">
            <input aria-label="Your question" value={question} maxLength={500} onChange={(e) => setQuestion(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && question.trim().length > 2 && !asking && ask()} className="flex-1 rounded-lg border border-ink/20 px-3 py-2.5" placeholder="e.g. Why does this matter for cost?" />
            <button className="btn-primary" disabled={asking || question.trim().length < 3} onClick={ask}>{asking ? '…' : t('explain.send')}</button>
          </div>
        ) : <p className="text-sm text-ink/70">You have used all follow-ups for this session. Reload the page for more.</p>}
        {chatError && <p role="alert" className="mt-2 text-sm text-red-700">{chatError}</p>}
      </section>
    </div>
  )
}
