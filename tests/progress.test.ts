import { describe, expect, it } from 'vitest'
import {
  exportProgressJson,
  importProgressJson,
  mergeProgress,
  progressExportSchema,
  type Progress,
} from '../src/lib/progress'

describe('Progress export, import, and merge', () => {
  it('merges progress using latest-timestamp-wins for review states', () => {
    const local: Progress = {
      attempts: [
        { questionId: 'cloud-basics-001', topicId: 'cloud-basics', isCorrect: true, at: 1000 },
      ],
      review: {
        'cloud-basics-001': { box: 2, dueAt: 2000, lastReviewedAt: 1000 },
        'cloud-basics-002': { box: 1, dueAt: 500, lastReviewedAt: 500 },
      },
      bank: {},
    }

    const remote: Progress = {
      attempts: [
        { questionId: 'cloud-basics-001', topicId: 'cloud-basics', isCorrect: true, at: 1000 },
        { questionId: 'cloud-basics-003', topicId: 'cloud-basics', isCorrect: false, at: 3000 },
      ],
      review: {
        // Newer review on question 1
        'cloud-basics-001': { box: 3, dueAt: 5000, lastReviewedAt: 2500 },
        // Older review on question 2
        'cloud-basics-002': { box: 1, dueAt: 100, lastReviewedAt: 100 },
        'cloud-basics-003': { box: 1, dueAt: 3000, lastReviewedAt: 3000 },
      },
      bank: {},
    }

    const merged = mergeProgress(local, remote)

    // Deduplicated attempts count = 2
    expect(merged.attempts).toHaveLength(2)
    // cloud-basics-001 took remote (lastReviewedAt 2500 > 1000)
    expect(merged.review['cloud-basics-001'].box).toBe(3)
    // cloud-basics-002 took local (lastReviewedAt 500 > 100)
    expect(merged.review['cloud-basics-002'].dueAt).toBe(500)
    // cloud-basics-003 was introduced from remote
    expect(merged.review['cloud-basics-003'].box).toBe(1)
  })

  it('validates schema on exported progress payload', () => {
    const jsonStr = exportProgressJson()
    const parsed = JSON.parse(jsonStr)
    const result = progressExportSchema.safeParse(parsed)
    expect(result.success).toBe(true)
  })

  it('rejects invalid JSON in importProgressJson', () => {
    const res = importProgressJson('{"invalid": true}')
    expect(res.success).toBe(false)
    expect(res.error).toBeDefined()
  })
})
