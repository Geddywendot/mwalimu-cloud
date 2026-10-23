import type { ReviewState } from '../types'

/** Leitner review interval (days) for boxes 1..5. */
export const INTERVALS_DAYS = [0, 1, 3, 7, 14] as const
export const MAX_BOX = INTERVALS_DAYS.length
const DAY_MS = 86_400_000

/**
 * Compute the next review state after an answer.
 * Correct: move up one box (capped at 5). Wrong: back to box 1.
 * @param prev previous state, or undefined if the question is new
 * @param correct whether the learner answered correctly
 * @param now timestamp in ms
 */
export function nextReviewState(prev: ReviewState | undefined, correct: boolean, now: number): ReviewState {
  const current = prev?.box ?? 1
  const box = correct ? Math.min(current + 1, MAX_BOX) : 1
  return { box, dueAt: now + INTERVALS_DAYS[box - 1] * DAY_MS, lastReviewedAt: now }
}

/** True when the question should appear in today's revision. */
export function isDue(state: ReviewState, now: number): boolean {
  return state.dueAt <= now
}

/** IDs of due questions, lowest box first (weakest first), then oldest due first. */
export function dueQuestionIds(review: Record<string, ReviewState>, now: number): string[] {
  return Object.entries(review)
    .filter(([, s]) => isDue(s, now))
    .sort(([, a], [, b]) => a.box - b.box || a.dueAt - b.dueAt)
    .map(([id]) => id)
}
