import { DOMAINS, TOPICS } from '../data/topics'
import type { Attempt } from '../types'

/** Number of most recent attempts per topic that count toward accuracy. */
export const RECENT_WINDOW = 20
/** Attempts needed on a topic before it can be called "Strong". */
export const MIN_ATTEMPTS_STRONG = 5
export const STRONG_THRESHOLD = 0.75
/** Total practice answers we suggest before the exam (used for the daily target). */
export const TARGET_ATTEMPTS = 200

export type TopicStatus = 'not_started' | 'learning' | 'strong'
export interface TopicStat { topicId: string; attempts: number; accuracy: number; status: TopicStatus }
export interface Readiness {
  topics: TopicStat[]
  domains: { id: string; title: string; score: number }[]
  overall: number
  label: string
}

/** Accuracy (0..1) over the last RECENT_WINDOW attempts of one topic. */
export function topicStat(topicId: string, attempts: Attempt[]): TopicStat {
  const recent = attempts.filter((a) => a.topicId === topicId).sort((a, b) => a.at - b.at).slice(-RECENT_WINDOW)
  if (recent.length === 0) return { topicId, attempts: 0, accuracy: 0, status: 'not_started' }
  const accuracy = recent.filter((a) => a.isCorrect).length / recent.length
  const strong = accuracy >= STRONG_THRESHOLD && recent.length >= MIN_ATTEMPTS_STRONG
  return { topicId, attempts: recent.length, accuracy, status: strong ? 'strong' : 'learning' }
}

/** Readiness label from an overall score in 0..100. */
export function readinessLabel(score: number): string {
  if (score >= 85) return 'Exam ready'
  if (score >= 75) return 'Almost ready'
  if (score >= 50) return 'Getting there'
  return 'Keep building'
}

/**
 * Domain score = mean accuracy over ALL topics in the domain (untouched topics count as 0,
 * so readiness reflects coverage as well as accuracy). Overall = weighted by DOMAINS[].weight.
 */
export function computeReadiness(attempts: Attempt[]): Readiness {
  const topics = TOPICS.map((t) => topicStat(t.id, attempts))
  const domains = DOMAINS.map((d) => {
    const own = TOPICS.filter((t) => t.domainId === d.id).map((t) => topics.find((s) => s.topicId === t.id)!)
    const score = (own.reduce((sum, s) => sum + s.accuracy, 0) / own.length) * 100
    return { id: d.id, title: d.title, score: Math.round(score) }
  })
  const overall = Math.round(DOMAINS.reduce((sum, d, i) => sum + d.weight * domains[i].score, 0))
  return { topics, domains, overall, label: readinessLabel(overall) }
}

/** The n weakest topics: attempted ones by lowest accuracy first, then untouched topics. */
export function weakestTopics(stats: TopicStat[], n = 5): TopicStat[] {
  const attempted = stats.filter((s) => s.attempts > 0).sort((a, b) => a.accuracy - b.accuracy)
  const fresh = stats.filter((s) => s.attempts === 0)
  return [...attempted, ...fresh].slice(0, n)
}

/** Suggested daily question count until the exam date. */
export function dailyTarget(totalAttempts: number, examDate: string | null, now = Date.now()): { days: number; perDay: number } | null {
  if (!examDate) return null
  const days = Math.ceil((new Date(examDate).getTime() - now) / 86_400_000)
  if (!Number.isFinite(days) || days <= 0) return null
  return { days, perDay: Math.max(10, Math.ceil(Math.max(TARGET_ATTEMPTS - totalAttempts, 0) / days)) }
}
