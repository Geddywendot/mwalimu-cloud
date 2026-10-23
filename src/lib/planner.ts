import { DOMAINS, TOPICS, topicById } from '../data/topics'
import type { TopicStat } from './readiness'

export interface StudySession {
  type: 'Revision' | 'Explain' | 'Quiz'
  topicId?: string
  topicTitle?: string
  estimatedMinutes: number
  description: string
}

export interface StudyDay {
  date: string
  dayIndex: number
  dayOfWeek: string
  sessions: StudySession[]
  totalMinutes: number
}

export interface StudyPlan {
  startDate: string
  examDate: string
  totalDays: number
  totalHours: number
  days: StudyDay[]
}

export interface PlannerOptions {
  examDate: string | null
  hoursPerWeekday: number
  weakTopicStats?: TopicStat[]
  startDate?: string
}

const DAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

/**
 * Pure function: generates an adaptive study plan up to the exam date,
 * prioritizing weak topics and higher-weight domains.
 */
export function generateStudyPlan(options: PlannerOptions): StudyPlan {
  const now = options.startDate ? new Date(options.startDate) : new Date()
  const exam = options.examDate ? new Date(options.examDate) : new Date(now.getTime() + 14 * 86_400_000)

  // Clamp plan between 3 and 45 days
  const diffDays = Math.ceil((exam.getTime() - now.getTime()) / 86_400_000)
  const totalDays = Math.min(Math.max(diffDays, 3), 45)
  const hours = Math.max(0.5, Math.min(options.hoursPerWeekday || 1, 6))

  // Sort topics by priority: attempted weak topics first (lowest accuracy), then unattempted by domain weight
  const domainWeightMap = new Map(DOMAINS.map((d) => [d.id, d.weight]))
  const statMap = new Map((options.weakTopicStats ?? []).map((s) => [s.topicId, s]))

  const prioritizedTopics = [...TOPICS].sort((a, b) => {
    const statA = statMap.get(a.id)
    const statB = statMap.get(b.id)
    const hasAttA = (statA?.attempts ?? 0) > 0
    const hasAttB = (statB?.attempts ?? 0) > 0

    // Attempted weak topics (< 0.75 accuracy) take top priority
    const weakA = hasAttA && (statA!.accuracy < 0.75)
    const weakB = hasAttB && (statB!.accuracy < 0.75)
    if (weakA && !weakB) return -1
    if (!weakA && weakB) return 1
    if (weakA && weakB) {
      if (statA!.accuracy !== statB!.accuracy) return statA!.accuracy - statB!.accuracy
    }

    // Fresh/unattempted topics come next (sorted by domain weight)
    if (!hasAttA && hasAttB) return -1
    if (hasAttA && !hasAttB) return 1

    const wA = domainWeightMap.get(a.domainId) ?? 0.3
    const wB = domainWeightMap.get(b.domainId) ?? 0.3
    return wB - wA
  })

  const days: StudyDay[] = []
  let topicIndex = 0
  let totalPlanMinutes = 0

  for (let i = 0; i < totalDays; i++) {
    const curDate = new Date(now.getTime() + i * 86_400_000)
    const dateStr = curDate.toISOString().slice(0, 10)
    const dayName = DAY_NAMES[curDate.getDay()]
    const sessions: StudySession[] = []

    const targetMinutes = Math.round(hours * 60)
    let dayMinutes = 0

    // 1. Revision session (spaced repetition)
    const revMins = Math.min(15, targetMinutes)
    sessions.push({
      type: 'Revision',
      estimatedMinutes: revMins,
      description: 'Review cards due today in Leitner Spaced Repetition.',
    })
    dayMinutes += revMins

    // 2. Focused Topic deep-dive (Explain)
    const topic = prioritizedTopics[topicIndex % prioritizedTopics.length]
    topicIndex++

    const explainMins = Math.min(25, Math.max(15, Math.round((targetMinutes - dayMinutes) * 0.5)))
    sessions.push({
      type: 'Explain',
      topicId: topic.id,
      topicTitle: topic.title,
      estimatedMinutes: explainMins,
      description: `Read African analogies and key terms for "${topic.title}".`,
    })
    dayMinutes += explainMins

    // 3. Practice Quiz
    const quizMins = Math.max(15, targetMinutes - dayMinutes)
    sessions.push({
      type: 'Quiz',
      topicId: topic.id,
      topicTitle: topic.title,
      estimatedMinutes: quizMins,
      description: `Take a 5-10 question quiz on "${topic.title}" to reinforce retention.`,
    })
    dayMinutes += quizMins

    totalPlanMinutes += dayMinutes

    days.push({
      date: dateStr,
      dayIndex: i + 1,
      dayOfWeek: dayName,
      sessions,
      totalMinutes: dayMinutes,
    })
  }

  return {
    startDate: now.toISOString().slice(0, 10),
    examDate: exam.toISOString().slice(0, 10),
    totalDays,
    totalHours: Math.round((totalPlanMinutes / 60) * 10) / 10,
    days,
  }
}
