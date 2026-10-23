import { BookOpen, Lightbulb, AlertTriangle, Route } from 'lucide-react'
import type { Explanation } from '../types'

export default function ExplanationCard({ e }: { e: Explanation }) {
  return (
    <div className="space-y-4">
      <section className="panel">
        <h2 className="mb-2 text-xl">In simple terms</h2>
        <p className="leading-relaxed">{e.simple_explanation}</p>
      </section>
      <section className="panel border-sun/60 bg-sun/10">
        <h2 className="mb-2 flex items-center gap-2 text-xl"><Route size={20} aria-hidden /> Think of it like this</h2>
        <p className="leading-relaxed">{e.african_analogy}</p>
        <p className="mt-3 text-sm text-ink/75"><strong>Where it breaks down:</strong> {e.analogy_limits}</p>
      </section>
      <section className="panel">
        <h2 className="mb-2 flex items-center gap-2 text-xl"><BookOpen size={20} aria-hidden /> Official-style definition</h2>
        <p className="leading-relaxed">{e.official_definition}</p>
      </section>
      <section className="panel">
        <h2 className="mb-3 text-xl">Key terms</h2>
        <dl className="space-y-2">
          {e.key_terms.map((k) => (
            <div key={k.term}><dt className="font-semibold">{k.term}</dt><dd className="text-ink/80">{k.meaning}</dd></div>
          ))}
        </dl>
      </section>
      <div className="grid gap-4 sm:grid-cols-2">
        <section className="panel"><h2 className="mb-1 flex items-center gap-2 text-lg"><Lightbulb size={18} aria-hidden /> Exam tip</h2><p>{e.exam_tip}</p></section>
        <section className="panel"><h2 className="mb-1 flex items-center gap-2 text-lg"><AlertTriangle size={18} aria-hidden /> Common mistake</h2><p>{e.common_mistake}</p></section>
      </div>
    </div>
  )
}
