import { z } from 'zod'
import { dueQuestionIds, nextReviewState } from './spacedRepetition'
import { supabase } from './supabase'
import type { Attempt, Question, ReviewState } from '../types'

/** Progress state stored locally and synchronized when signed in. */
export interface Progress {
  attempts: Attempt[]
  review: Record<string, ReviewState>
  bank: Record<string, Question>
}

const KEY = 'mwalimu.progress.v1'
export const emptyProgress = (): Progress => ({ attempts: [], review: {}, bank: {} })

export const progressExportSchema = z.object({
  version: z.literal(1),
  exportedAt: z.number(),
  attempts: z.array(
    z.object({
      questionId: z.string(),
      topicId: z.string(),
      isCorrect: z.boolean(),
      at: z.number(),
    })
  ),
  review: z.record(
    z.object({
      box: z.number().int().min(1).max(5),
      dueAt: z.number(),
      lastReviewedAt: z.number(),
    })
  ),
})

export type ProgressExport = z.infer<typeof progressExportSchema>

export function loadProgress(): Progress {
  try {
    return { ...emptyProgress(), ...(JSON.parse(localStorage.getItem(KEY) ?? '{}') as Partial<Progress>) }
  } catch {
    return emptyProgress()
  }
}

export function saveProgress(p: Progress): void {
  try {
    localStorage.setItem(KEY, JSON.stringify(p))
  } catch {
    /* storage quota exceeded or disabled */
  }
}

/** Record one answer: attempt log, Leitner state, question bank copy, optional cloud sync. */
export async function recordAnswer(
  q: Question,
  selected: string[],
  isCorrect: boolean,
  timeMs: number
): Promise<void> {
  const now = Date.now()
  const p = loadProgress()
  p.attempts.push({ questionId: q.id, topicId: q.topic_id, isCorrect, at: now })
  p.review[q.id] = nextReviewState(p.review[q.id], isCorrect, now)
  p.bank[q.id] = q
  saveProgress(p)

  if (!supabase) return
  try {
    const { data } = await supabase.auth.getSession()
    const uid = data.session?.user.id
    if (!uid) return
    const r = p.review[q.id]
    await supabase.from('attempts').insert({
      user_id: uid,
      question_id: q.id,
      selected,
      is_correct: isCorrect,
      time_ms: timeMs,
    })
    await supabase.from('review_state').upsert({
      user_id: uid,
      question_id: q.id,
      box: r.box,
      due_at: new Date(r.dueAt).toISOString(),
      last_reviewed_at: new Date(r.lastReviewedAt).toISOString(),
    })
  } catch {
    /* offline: local copy remains saved */
  }
}

/** Questions due for revision now (weakest first). */
export function dueQuestions(now = Date.now()): Question[] {
  const p = loadProgress()
  return dueQuestionIds(p.review, now)
    .map((id) => p.bank[id])
    .filter(Boolean)
}

export function resetProgress(): void {
  localStorage.removeItem(KEY)
}

/**
 * Pure function: merges local and remote progress using latest-timestamp-wins strategy.
 */
export function mergeProgress(local: Progress, remote: Progress): Progress {
  // Merge attempts by unique combination of (questionId, at)
  const attemptMap = new Map<string, Attempt>()
  for (const a of local.attempts) {
    attemptMap.set(`${a.questionId}_${a.at}`, a)
  }
  for (const a of remote.attempts) {
    attemptMap.set(`${a.questionId}_${a.at}`, a)
  }
  const mergedAttempts = Array.from(attemptMap.values()).sort((a, b) => a.at - b.at)

  // Merge review states: latest lastReviewedAt wins for each question
  const allQuestionIds = new Set([
    ...Object.keys(local.review),
    ...Object.keys(remote.review),
  ])
  const mergedReview: Record<string, ReviewState> = {}

  for (const qid of allQuestionIds) {
    const l = local.review[qid]
    const r = remote.review[qid]
    if (l && !r) {
      mergedReview[qid] = l
    } else if (!l && r) {
      mergedReview[qid] = r
    } else if (l && r) {
      // Latest review timestamp wins
      mergedReview[qid] = l.lastReviewedAt >= r.lastReviewedAt ? l : r
    }
  }

  // Merge bank
  const mergedBank = { ...local.bank, ...remote.bank }

  return {
    attempts: mergedAttempts,
    review: mergedReview,
    bank: mergedBank,
  }
}

/**
 * Serializes progress into a downloadable JSON file payload.
 */
export function exportProgressJson(): string {
  const p = loadProgress()
  const payload: ProgressExport = {
    version: 1,
    exportedAt: Date.now(),
    attempts: p.attempts,
    review: p.review,
  }
  return JSON.stringify(payload, null, 2)
}

/**
 * Validates and imports progress from an external JSON string.
 */
export function importProgressJson(jsonString: string): { success: boolean; error?: string } {
  try {
    const raw = JSON.parse(jsonString)
    const parsed = progressExportSchema.safeParse(raw)
    if (!parsed.success) {
      return { success: false, error: 'Invalid progress file format.' }
    }

    const current = loadProgress()
    const imported: Progress = {
      attempts: parsed.data.attempts,
      review: parsed.data.review,
      bank: current.bank, // Preserve existing cached questions
    }

    const merged = mergeProgress(current, imported)
    saveProgress(merged)
    window.dispatchEvent(new Event('mwalimu:progress'))
    return { success: true }
  } catch (e) {
    return { success: false, error: (e as Error).message }
  }
}
