import { describe, expect, it } from 'vitest'
import { computeReadiness, readinessLabel, topicStat, weakestTopics } from '../src/lib/readiness'
import { TOPICS } from '../src/data/topics'
import type { Attempt } from '../src/types'

const mk = (topicId: string, correct: boolean, at: number): Attempt => ({ questionId: `q${at}`, topicId, isCorrect: correct, at })

describe('readiness', () => {
  it('labels follow the thresholds', () => {
    expect(readinessLabel(49)).toBe('Keep building')
    expect(readinessLabel(50)).toBe('Getting there')
    expect(readinessLabel(75)).toBe('Almost ready')
    expect(readinessLabel(85)).toBe('Exam ready')
  })
  it('only the last 20 attempts count', () => {
    const old = Array.from({ length: 20 }, (_, i) => mk('cloud-basics', false, i))
    const recent = Array.from({ length: 20 }, (_, i) => mk('cloud-basics', true, 100 + i))
    expect(topicStat('cloud-basics', [...old, ...recent]).accuracy).toBe(1)
  })
  it('needs 5 attempts to be Strong', () => {
    expect(topicStat('cloud-basics', [mk('cloud-basics', true, 1)]).status).toBe('learning')
    const five = Array.from({ length: 5 }, (_, i) => mk('cloud-basics', true, i))
    expect(topicStat('cloud-basics', five).status).toBe('strong')
  })
  it('perfect everywhere gives 100 overall', () => {
    const all = TOPICS.flatMap((t) => Array.from({ length: 5 }, (_, i) => mk(t.id, true, i)))
    expect(computeReadiness(all).overall).toBe(100)
  })
  it('no attempts gives 0 and weakest list is untouched topics', () => {
    const r = computeReadiness([])
    expect(r.overall).toBe(0)
    expect(weakestTopics(r.topics, 5)).toHaveLength(5)
  })
})
