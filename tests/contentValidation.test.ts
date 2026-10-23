import { describe, expect, it } from 'vitest'
import { validateContent } from '../scripts/validate-content'

describe('Content validation', () => {
  it('validates that all content files meet brief constraints and quality gates', () => {
    const result = validateContent()
    if (!result.valid) {
      console.error('Validation errors:', result.errors)
    }
    expect(result.errors).toEqual([])
    expect(result.valid).toBe(true)
    expect(result.stats.totalTopics).toBe(15)
    expect(result.stats.totalQuestions).toBeGreaterThanOrEqual(120)
    expect(result.stats.totalFollowupsEn).toBe(60)
    expect(result.stats.totalFollowupsSw).toBe(60)
  })
})
