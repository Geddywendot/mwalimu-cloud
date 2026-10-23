import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ShieldCheck, Flag, RefreshCw, Trash2, Code2, Database } from 'lucide-react'
import { getFlaggedQuestions } from '../lib/api'
import { contentMode } from '../lib/content'

export default function About() {
  const [flags, setFlags] = useState(() => getFlaggedQuestions())

  const clearFlags = () => {
    localStorage.removeItem('mwalimu.flags.v1')
    setFlags([])
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6 py-4">
      <div>
        <Link to="/topics" className="text-sm text-tide underline hover:text-ink">
          ← Back to topics
        </Link>
        <h1 className="mt-2 text-3xl font-bold">About Mwalimu Cloud</h1>
        <p className="mt-1 text-ink/75">
          Curated AZ-900 exam preparation built for African developers, engineers, and students.
        </p>
      </div>

      <section className="panel space-y-3">
        <h2 className="flex items-center gap-2 text-xl font-bold">
          <ShieldCheck className="text-tide" size={22} /> Integrity &amp; Standards
        </h2>
        <p className="text-sm leading-relaxed text-ink/85">
          <strong>Unofficial study tool. Not affiliated with or endorsed by Microsoft.</strong>
        </p>
        <p className="text-sm leading-relaxed text-ink/85">
          Mwalimu Cloud does not use Microsoft logos or copyrighted branding. All questions in our curated
          bank are 100% original scenarios author-crafted strictly from the public Microsoft Learn AZ-900 skills outline.
          We never use or distribute exam brain dumps.
        </p>
      </section>

      <section className="panel space-y-3">
        <h2 className="flex items-center gap-2 text-xl font-bold">
          <Code2 className="text-tide" size={22} /> Architecture: Curated Offline-First
        </h2>
        <p className="text-sm leading-relaxed text-ink/85">
          Because most learners face mobile bandwidth constraints or lack paid AI subscriptions, Mwalimu Cloud
          operates in <strong>Curated Content Mode</strong> by default. Explanations, questions, and follow-ups
          are bundled directly into the app shell. After first loading, you can study completely offline.
        </p>
        <div className="rounded-lg bg-mist/60 p-3 text-xs text-ink/80">
          <p>
            <strong>Active Mode:</strong> {contentMode.toUpperCase()}
          </p>
          <p className="mt-1">
            {contentMode === 'static'
              ? 'Serving static JSON content with zero network calls and full offline support.'
              : 'Connected to live Supabase Edge Functions with Claude fallback.'}
          </p>
        </div>
      </section>

      {/* Hidden Debug & Content Moderation Section */}
      <section className="panel border-ink/20 space-y-4" aria-labelledby="debug-heading">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-ink/10 pb-3">
          <h2 id="debug-heading" className="flex items-center gap-2 text-lg font-bold">
            <Flag className="text-sun" size={20} />
            Question Quality &amp; Flagged Items (Debug)
          </h2>
          {flags.length > 0 && (
            <button
              onClick={clearFlags}
              className="flex items-center gap-1 text-xs font-semibold text-red-700 hover:underline"
            >
              <Trash2 size={14} /> Clear flags
            </button>
          )}
        </div>

        <p className="text-xs text-ink/70">
          When learners tap "Report this question" during quizzes, the question ID is logged here locally in
          localStorage. In live mode, it also syncs to the backend for content author review.
        </p>

        {flags.length === 0 ? (
          <div className="rounded-lg bg-mist/40 p-4 text-center text-sm text-ink/60">
            No questions currently flagged. Everything looks good!
          </div>
        ) : (
          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-wider text-ink/60">
              {flags.length} Flagged Question{flags.length > 1 ? 's' : ''}:
            </p>
            <ul className="divide-y divide-ink/10 rounded-lg border border-ink/15 bg-paper">
              {flags.map((f) => (
                <li key={f.id} className="flex items-center justify-between p-3 text-sm">
                  <span className="font-mono font-medium text-ink">{f.id}</span>
                  <span className="text-xs text-ink/50">
                    {new Date(f.flaggedAt).toLocaleString()}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="flex items-center gap-2 pt-2">
          <button
            onClick={() => setFlags(getFlaggedQuestions())}
            className="btn-ghost text-xs font-semibold"
          >
            <RefreshCw size={14} /> Refresh local debug log
          </button>
        </div>
      </section>

      <section className="panel space-y-2">
        <h2 className="flex items-center gap-2 text-base font-bold">
          <Database size={18} className="text-tide" /> Data &amp; Privacy
        </h2>
        <p className="text-xs text-ink/75 leading-relaxed">
          In guest mode, your test attempts and Leitner repetition cards reside entirely within your browser's
          localStorage. You can download a backup JSON file anytime from the Progress Dashboard.
        </p>
      </section>
    </div>
  )
}
