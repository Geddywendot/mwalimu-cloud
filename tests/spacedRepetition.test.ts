import { describe, expect, it } from 'vitest'
import { dueQuestionIds, nextReviewState } from '../src/lib/spacedRepetition'

const DAY = 86_400_000
const now = 1_000_000_000_000

describe('Leitner spaced repetition', () => {
  it('starts a new question correct -> box 2, due in 1 day', () => {
    const s = nextReviewState(undefined, true, now)
    expect(s.box).toBe(2)
    expect(s.dueAt).toBe(now + DAY)
  })
  it('new wrong answer -> box 1, due now', () => {
    const s = nextReviewState(undefined, false, now)
    expect(s.box).toBe(1)
    expect(s.dueAt).toBe(now)
  })
  it('wrong answer resets any box to 1', () => {
    expect(nextReviewState({ box: 4, dueAt: 0, lastReviewedAt: 0 }, false, now).box).toBe(1)
  })
  it('caps at box 5 with 14-day interval', () => {
    const s = nextReviewState({ box: 5, dueAt: 0, lastReviewedAt: 0 }, true, now)
    expect(s.box).toBe(5)
    expect(s.dueAt).toBe(now + 14 * DAY)
  })
  it('lists due questions, weakest box first', () => {
    const review = {
      a: { box: 3, dueAt: now - 1, lastReviewedAt: 0 },
      b: { box: 1, dueAt: now, lastReviewedAt: 0 },
      c: { box: 2, dueAt: now + DAY, lastReviewedAt: 0 },
    }
    expect(dueQuestionIds(review, now)).toEqual(['b', 'a'])
  })
})
