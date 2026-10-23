import { contentMode, getExplanation, getFollowups, getQuiz, askLiveFollowup } from './content'
import { supabase } from './supabase'
import type { Explanation, FollowupQA, Question } from '../types'

const FLAGS_KEY = 'mwalimu.flags.v1'

/**
 * Loads list of locally reported/flagged question IDs.
 */
export function getFlaggedQuestions(): Array<{ id: string; flaggedAt: number }> {
  try {
    const raw = localStorage.getItem(FLAGS_KEY)
    return raw ? (JSON.parse(raw) as Array<{ id: string; flaggedAt: number }>) : []
  } catch {
    return []
  }
}

/**
 * Flags a question: always persists locally in localStorage, and only syncs to Supabase in live mode.
 */
export async function flagQuestion(id: string): Promise<void> {
  try {
    const flags = getFlaggedQuestions()
    if (!flags.some((f) => f.id === id)) {
      flags.push({ id, flaggedAt: Date.now() })
      localStorage.setItem(FLAGS_KEY, JSON.stringify(flags))
    }
  } catch {
    /* storage full or unavailable */
  }

  // Only sync to Supabase in live mode if configured
  if (contentMode === 'live' && supabase) {
    try {
      await supabase.rpc('flag_question', { qid: id })
    } catch (e) {
      console.warn('Failed to sync question flag to Supabase:', e)
    }
  }
}

/**
 * Bridge function to fetch explanation using the active ContentProvider.
 */
export async function fetchExplanation(
  topicId: string,
  language: string,
  simpler: boolean
): Promise<Explanation> {
  return getExplanation(topicId, language, simpler ? 'simpler' : 'standard')
}

/**
 * Bridge function to fetch quiz questions using the active ContentProvider.
 */
export async function fetchQuiz(
  topicIds: string[],
  count: 5 | 10,
  language: string
): Promise<{ questions: Question[]; notice?: string }> {
  return getQuiz(topicIds, count, language)
}

/**
 * Retrieves curated follow-up Q&A pairs for static mode.
 */
export async function fetchFollowups(topicId: string, language: string): Promise<FollowupQA[]> {
  return getFollowups(topicId, language)
}

/**
 * Submits a free-text follow-up question (available in live mode).
 */
export async function askFollowup(
  topicId: string,
  question: string,
  language: string
): Promise<{ on_topic: boolean; answer: string }> {
  return askLiveFollowup(topicId, question, language)
}
