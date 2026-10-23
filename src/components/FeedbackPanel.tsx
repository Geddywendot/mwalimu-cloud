import { CheckCircle2, XCircle } from 'lucide-react'
import { Link } from 'react-router-dom'
import type { Question } from '../types'

export default function FeedbackPanel({ q, correct }: { q: Question; correct: boolean }) {
  const wrong = q.options.filter((o) => !q.correct_option_ids.includes(o.id))
  return (
    <div className={`pop mt-4 rounded-xl border p-4 ${correct ? 'border-tide bg-tide/10' : 'border-red-700/40 bg-red-50'}`} role="status">
      <p className="flex items-center gap-2 text-lg font-semibold">
        {correct ? <CheckCircle2 aria-hidden className="text-tide" /> : <XCircle aria-hidden className="text-red-700" />}
        {correct ? 'Correct. Nice one!' : 'Not quite.'}
      </p>
      <p className="mt-2">{q.explanation_correct}</p>
      {wrong.length > 0 && (
        <ul className="mt-3 space-y-1 text-sm text-ink/80">
          {wrong.map((o) => (<li key={o.id}><strong>{o.id}. {o.text}:</strong> {q.explanation_wrong[o.id]}</li>))}
        </ul>
      )}
      <Link className="mt-3 inline-block text-sm font-semibold text-tide underline" to={`/explain/${q.topic_id}`}>Review the explanation for this topic</Link>
    </div>
  )
}
