import { dueQuestionIds, nextReviewState } from './spacedRepetition'
import { supabase } from './supabase'
import type { Attempt, Question, ReviewState } from '../types'

/**
 * Progress lives in localStorage (works for guests and offline). When signed in, each answer is
 * ALSO written to Supabase (best effort) so it is safe in the database. See README > Limitations.
 */
interface Progress { attempts: Attempt[]; review: Record<string, ReviewState>; bank: Record<string, Question> }
const KEY = 'mwalimu.progress.v1'
const empty = (): Progress => ({ attempts: [], review: {}, bank: {} })

export function loadProgress(): Progress {
  try {
    return { ...empty(), ...(JSON.parse(localStorage.getItem(KEY) ?? '{}') as Partial<Progress>) }
  } catch {
    return empty()
  }
}
const save = (p: Progress) => { try { localStorage.setItem(KEY, JSON.stringify(p)) } catch { /* storage full or blocked */ } }

/** Record one answer: attempt log, Leitner state, question bank copy, optional cloud sync. */
export async function recordAnswer(q: Question, selected: string[], isCorrect: boolean, timeMs: number): Promise<void> {
  const now = Date.now()
  const p = loadProgress()
  p.attempts.push({ questionId: q.id, topicId: q.topic_id, isCorrect, at: now })
  p.review[q.id] = nextReviewState(p.review[q.id], isCorrect, now)
  p.bank[q.id] = q
  save(p)

  if (!supabase) return
  try {
    const { data } = await supabase.auth.getSession()
    const uid = data.session?.user.id
    if (!uid) return
    const r = p.review[q.id]
    await supabase.from('attempts').insert({ user_id: uid, question_id: q.id, selected, is_correct: isCorrect, time_ms: timeMs })
    await supabase.from('review_state').upsert({ user_id: uid, question_id: q.id, box: r.box, due_at: new Date(r.dueAt).toISOString(), last_reviewed_at: new Date(r.lastReviewedAt).toISOString() })
  } catch { /* offline: local copy is still saved */ }
}

/** Questions due for revision now (weakest first). */
export function dueQuestions(now = Date.now()): Question[] {
  const p = loadProgress()
  return dueQuestionIds(p.review, now).map((id) => p.bank[id]).filter(Boolean)
}

export function resetProgress() { localStorage.removeItem(KEY) }
