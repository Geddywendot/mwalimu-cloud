import { staticProvider } from './staticProvider'
import { liveProvider } from './liveProvider'
import type { ContentProvider, Explanation, FollowupQA, Question } from '../../types'

export type ContentMode = 'static' | 'live'

/**
 * Determines active content mode from environment variable.
 * Defaults strictly to 'static' if unspecified.
 */
export function getContentMode(): ContentMode {
  const mode = import.meta.env.VITE_CONTENT_MODE
  return mode === 'live' ? 'live' : 'static'
}

export const contentMode: ContentMode = getContentMode()

/** Active provider determined by VITE_CONTENT_MODE. */
export const provider: ContentProvider = contentMode === 'live' ? liveProvider : staticProvider

/**
 * High-level helper to fetch topic explanation using the active provider.
 */
export async function getExplanation(
  topicId: string,
  language: string,
  level: 'standard' | 'simpler'
): Promise<Explanation> {
  return provider.getExplanation(topicId, language, level)
}

/**
 * High-level helper to sample quiz questions using the active provider.
 */
export async function getQuiz(
  topicIds: string[],
  count: 5 | 10,
  language: string
): Promise<{ questions: Question[]; notice?: string }> {
  return provider.getQuiz(topicIds, count, language)
}

/**
 * High-level helper to retrieve curated follow-up Q&As for a topic.
 */
export async function getFollowups(topicId: string, language: string): Promise<FollowupQA[]> {
  return provider.getFollowups(topicId, language)
}

/**
 * Optional helper for live free-text follow-up questions.
 */
export async function askLiveFollowup(
  topicId: string,
  question: string,
  language: string
): Promise<{ on_topic: boolean; answer: string }> {
  if (provider.askLiveFollowup) {
    return provider.askLiveFollowup(topicId, question, language)
  }
  throw new Error('Free-text AI follow-up is only available in live mode.')
}
