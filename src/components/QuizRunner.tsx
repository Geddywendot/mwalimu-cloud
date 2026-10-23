import { useState } from 'react'
import { Flag } from 'lucide-react'
import { Link } from 'react-router-dom'
import FeedbackPanel from './FeedbackPanel'
import { flagQuestion } from '../lib/api'
import { recordAnswer } from '../lib/progress'
import { useSettings } from '../hooks/useSettings'
import type { Question } from '../types'

/** Runs a list of questions: select, check, feedback, next, results. Used by Quiz and Revision. */
export default function QuizRunner({ questions }: { questions: Question[] }) {
  const { t } = useSettings()
  const [i, setI] = useState(0)
  const [selected, setSelected] = useState<string[]>([])
  const [checked, setChecked] = useState(false)
  const [score, setScore] = useState(0)
  const [flagged, setFlagged] = useState(false)
  const [startedAt, setStartedAt] = useState(Date.now())

  if (i >= questions.length) {
    return (
      <div className="panel text-center">
        <h2 className="text-2xl">You got {score} of {questions.length}</h2>
        <p className="mt-2 text-ink/70">Missed questions will come back in Revision.</p>
        <div className="mt-5 flex justify-center gap-3">
          <Link to="/dashboard" className="btn-primary">See your progress</Link>
          <Link to="/topics" className="btn-ghost">Back to topics</Link>
        </div>
      </div>
    )
  }

  const q = questions[i]
  const multi = q.type === 'multiple'
  const isCorrect = q.correct_option_ids.length === selected.length && q.correct_option_ids.every((id) => selected.includes(id))

  const toggle = (id: string) => {
    if (checked) return
    setSelected((s) => (multi ? (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]) : [id]))
  }
  const check = async () => {
    setChecked(true)
    if (isCorrect) setScore((s) => s + 1)
    await recordAnswer(q, selected, isCorrect, Date.now() - startedAt)
  }
  const next = () => { setI(i + 1); setSelected([]); setChecked(false); setFlagged(false); setStartedAt(Date.now()) }

  return (
    <div className="panel">
      <p className="text-sm text-ink/60">Question {i + 1} of {questions.length}{multi ? ' · Select all that apply' : ''}</p>
      <h2 className="mt-2 text-xl leading-snug">{q.question}</h2>
      <fieldset className="mt-4 space-y-2">
        <legend className="sr-only">Answer options</legend>
        {q.options.map((o) => {
          const on = selected.includes(o.id)
          const right = checked && q.correct_option_ids.includes(o.id)
          const bad = checked && on && !right
          return (
            <label key={o.id} className={`flex cursor-pointer items-start gap-3 rounded-lg border p-3 ${right ? 'border-tide bg-tide/10' : bad ? 'border-red-700/50 bg-red-50' : on ? 'border-ink bg-mist' : 'border-ink/15 hover:bg-mist'}`}>
              <input type={multi ? 'checkbox' : 'radio'} name="answer" className="mt-1" checked={on} disabled={checked} onChange={() => toggle(o.id)} />
              <span><strong>{o.id}.</strong> {o.text}</span>
            </label>
          )
        })}
      </fieldset>
      {checked && <FeedbackPanel q={q} correct={isCorrect} />}
      <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
        {!checked ? (
          <button className="btn-primary" disabled={selected.length === 0} onClick={check}>{t('quiz.check')}</button>
        ) : (
          <button className="btn-accent" onClick={next}>{i + 1 === questions.length ? t('quiz.finish') : t('quiz.next')}</button>
        )}
        <button className="btn-ghost text-sm" disabled={flagged} onClick={() => { setFlagged(true); void flagQuestion(q.id) }}>
          <Flag size={16} aria-hidden /> {flagged ? 'Reported. Thank you' : t('quiz.report')}
        </button>
      </div>
    </div>
  )
}
