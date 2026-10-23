import { describe, expect, it } from 'vitest'
import { generateStudyPlan } from '../src/lib/planner'

describe('Study Planner algorithm', () => {
  it('generates a day-by-day study plan with revision, explain, and quiz sessions', () => {
    const plan = generateStudyPlan({
      startDate: '2026-11-01',
      examDate: '2026-11-15',
      hoursPerWeekday: 1.5,
    })

    expect(plan.totalDays).toBe(14)
    expect(plan.days).toHaveLength(14)
    expect(plan.totalHours).toBeGreaterThan(0)

    const firstDay = plan.days[0]
    expect(firstDay.date).toBe('2026-11-01')
    expect(firstDay.sessions.some((s) => s.type === 'Revision')).toBe(true)
    expect(firstDay.sessions.some((s) => s.type === 'Explain')).toBe(true)
    expect(firstDay.sessions.some((s) => s.type === 'Quiz')).toBe(true)
  })

  it('clamps plan length to sensible boundaries', () => {
    // Exam tomorrow: clamped to minimum 3 days
    const shortPlan = generateStudyPlan({
      startDate: '2026-11-01',
      examDate: '2026-11-02',
      hoursPerWeekday: 1,
    })
    expect(shortPlan.totalDays).toBe(3)

    // Exam in 100 days: clamped to maximum 45 days
    const longPlan = generateStudyPlan({
      startDate: '2026-11-01',
      examDate: '2027-03-01',
      hoursPerWeekday: 1,
    })
    expect(longPlan.totalDays).toBe(45)
  })

  it('prioritizes weak topics at the start of the study schedule', () => {
    const weakStats = [
      { topicId: 'gov-monitor', attempts: 5, accuracy: 0.2, status: 'learning' as const },
      { topicId: 'cloud-basics', attempts: 10, accuracy: 0.9, status: 'strong' as const },
    ]

    const plan = generateStudyPlan({
      startDate: '2026-11-01',
      examDate: '2026-11-08',
      hoursPerWeekday: 1,
      weakTopicStats: weakStats,
    })

    // The first day's Explain topic should be the weak topic ('gov-monitor')
    const firstExplain = plan.days[0].sessions.find((s) => s.type === 'Explain')
    expect(firstExplain?.topicId).toBe('gov-monitor')
  })
})
