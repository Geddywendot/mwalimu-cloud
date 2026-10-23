import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { ChevronDown, ChevronUp, HelpCircle, MessageSquare } from 'lucide-react'
import ExplanationCard from '../components/ExplanationCard'
import HonestyBadges from '../components/HonestyBadges'
import { askFollowup, fetchExplanation, fetchFollowups } from '../lib/api'
import { contentMode } from '../lib/content'
import { topicById } from '../data/topics'
import { useSettings } from '../hooks/useSettings'
import type { FollowupQA } from '../types'

const MAX_FOLLOWUPS = 5

export default function Explain() {
  const { topicId = '' } = useParams()
  const topic = topicById(topicId)
  const { settings, t } = useSettings()
  const [simpler, setSimpler] = useState(false)

  // Query for explanation
  const q = useQuery({
    queryKey: ['explain', topicId, settings.language, simpler],
    queryFn: () => fetchExplanation(topicId, settings.language, simpler),
    enabled: Boolean(topic),
  })

  // Query for curated follow-ups in static mode
  const followupsQuery = useQuery({
    queryKey: ['followups', topicId, settings.language],
    queryFn: () => fetchFollowups(topicId, settings.language),
    enabled: Boolean(topic),
  })

  // Selected chip in static mode
  const [activeChipId, setActiveChipId] = useState<string | null>(null)

  // Live chat state
  const [question, setQuestion] = useState('')
  const [chat, setChat] = useState<{ q: string; a: string }[]>([])
  const [asking, setAsking] = useState(false)
  const [chatError, setChatError] = useState('')

  if (!topic) {
    return (
      <div className="panel my-8 text-center">
        <p className="text-lg">Topic not found.</p>
        <Link className="btn-primary mt-4 inline-block" to="/topics">
          Back to topics
        </Link>
      </div>
    )
  }

  const ask = async () => {
    if (!question.trim()) return
    setAsking(true)
    setChatError('')
    try {
      const r = await askFollowup(topicId, question, settings.language)
      setChat((c) => [...c, { q: question, a: r.answer }])
      setQuestion('')
    } catch (e) {
      setChatError(e instanceof Error ? e.message : 'Could not answer. Retry.')
    }
    setAsking(false)
  }

  return (
    <div className="space-y-5">
      <div>
        <Link to="/topics" className="text-sm text-tide underline hover:text-ink">
          ← All topics
        </Link>
        <div className="mt-1 flex flex-wrap items-center justify-between gap-2">
          <h1 className="text-3xl font-bold">{topic.title}</h1>
          <HonestyBadges />
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-ink/10 bg-white p-3">
        <label className="flex cursor-pointer items-center gap-2 font-semibold text-sm">
          <input
            type="checkbox"
            checked={simpler}
            onChange={(e) => setSimpler(e.target.checked)}
            className="h-4 w-4 rounded border-ink/30 text-tide focus:ring-tide"
          />
          {t('explain.simpler')}
        </label>
        <Link to={`/quiz?topic=${topicId}`} className="btn-accent text-sm">
          {t('explain.quiz')}
        </Link>
      </div>

      {q.isLoading && (
        <div className="panel animate-pulse space-y-3" aria-busy>
          <div className="h-5 w-1/3 rounded bg-mist" />
          <div className="h-4 rounded bg-mist" />
          <div className="h-4 w-5/6 rounded bg-mist" />
        </div>
      )}

      {q.isError && (
        <div className="panel border-red-700/40 bg-red-50" role="alert">
          <p className="text-red-900">{(q.error as Error).message}</p>
          <button className="btn-primary mt-3 text-sm" onClick={() => q.refetch()}>
            Retry
          </button>
        </div>
      )}

      {q.data && <ExplanationCard e={q.data} />}

      {/* Follow-up Section */}
      {contentMode === 'static' ? (
        <section className="panel" aria-labelledby="followups-heading">
          <h2 id="followups-heading" className="mb-2 flex items-center gap-2 text-xl font-bold">
            <HelpCircle size={20} className="text-tide" />
            {t('explain.common_questions')}
          </h2>
          <p className="mb-4 text-xs text-ink/70">
            Tappable questions curated to clarify key AZ-900 exam concepts:
          </p>

          <div className="space-y-2">
            {(followupsQuery.data ?? []).map((item: FollowupQA) => {
              const isOpen = activeChipId === item.id
              return (
                <div
                  key={item.id}
                  className="rounded-lg border border-ink/15 overflow-hidden transition-colors"
                >
                  <button
                    className={`flex w-full items-center justify-between p-3.5 text-left text-sm font-semibold transition-colors ${
                      isOpen ? 'bg-mist text-ink' : 'bg-white hover:bg-mist/50'
                    }`}
                    onClick={() => setActiveChipId(isOpen ? null : item.id)}
                    aria-expanded={isOpen}
                  >
                    <span>{item.question}</span>
                    {isOpen ? (
                      <ChevronUp size={16} className="shrink-0 text-ink/60" />
                    ) : (
                      <ChevronDown size={16} className="shrink-0 text-ink/60" />
                    )}
                  </button>
                  {isOpen && (
                    <div className="border-t border-ink/10 bg-paper p-4 text-sm leading-relaxed text-ink/90">
                      {item.answer}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </section>
      ) : (
        <section className="panel" aria-labelledby="ask-heading">
          <h2 id="ask-heading" className="mb-3 flex items-center gap-2 text-xl">
            <MessageSquare size={20} className="text-tide" />
            {t('explain.ask')} ({MAX_FOLLOWUPS - chat.length} left)
          </h2>
          {chat.map((m, i) => (
            <div key={i} className="mb-3 rounded-lg bg-mist/50 p-3">
              <p className="font-semibold text-sm">{m.q}</p>
              <p className="mt-1 whitespace-pre-line text-sm text-ink/85">{m.a}</p>
            </div>
          ))}
          {chat.length < MAX_FOLLOWUPS ? (
            <div className="flex gap-2">
              <input
                aria-label="Your question"
                value={question}
                maxLength={500}
                onChange={(e) => setQuestion(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && question.trim().length > 2 && !asking && ask()}
                className="flex-1 rounded-lg border border-ink/20 px-3 py-2 text-sm"
                placeholder="e.g. Why does this matter for cost?"
              />
              <button
                className="btn-primary text-sm"
                disabled={asking || question.trim().length < 3}
                onClick={ask}
              >
                {asking ? '…' : t('explain.send')}
              </button>
            </div>
          ) : (
            <p className="text-sm text-ink/70">
              You have used all live follow-ups for this session. Reload to reset.
            </p>
          )}
          {chatError && (
            <p role="alert" className="mt-2 text-sm text-red-700">
              {chatError}
            </p>
          )}
        </section>
      )}
    </div>
  )
}
