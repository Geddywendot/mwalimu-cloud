import { supabase } from '../supabase'
import { explanationSchema, questionSchema } from '../schemas'
import { staticProvider } from './staticProvider'
import type { ContentProvider, Explanation, FollowupQA, Question } from '../../types'

async function invokeEdge<T>(fn: string, body: Record<string, unknown>): Promise<T> {
  if (!supabase) {
    throw new Error('Supabase client not configured. Check VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your .env file.')
  }
  const { data, error } = await supabase.functions.invoke(fn, { body })
  if (error) {
    let msg = 'Live AI request failed. Falling back to curated content.'
    try {
      const errObj = error as { context?: Response }
      if (errObj.context) {
        const bodyJson = await errObj.context.json()
        msg = bodyJson.error ?? msg
      }
    } catch {
      /* ignore JSON parse failure */
    }
    throw new Error(msg)
  }
  return data as T
}

/**
 * Live AI content provider backed by Supabase Edge Functions.
 * Falls back to staticProvider if Edge Functions are unavailable or unconfigured.
 */
export const liveProvider: ContentProvider = {
  async getExplanation(topicId: string, language: string, level: 'standard' | 'simpler'): Promise<Explanation> {
    try {
      const res = await invokeEdge<{ explanation: unknown }>('explain', {
        topicId,
        language,
        level,
      })
      return explanationSchema.parse(res.explanation) as Explanation
    } catch (e) {
      console.warn('Live explanation failed, falling back to static content:', e)
      return staticProvider.getExplanation(topicId, language, level)
    }
  },

  async getQuiz(topicIds: string[], count: 5 | 10, language: string): Promise<{ questions: Question[]; notice?: string }> {
    try {
      const res = await invokeEdge<{ questions: unknown[]; notice?: string }>('generate-quiz', {
        topicIds,
        count,
        language,
      })
      const questions = res.questions.map((q) => questionSchema.parse(q)) as Question[]
      return { questions, notice: res.notice }
    } catch (e) {
      console.warn('Live quiz generation failed, falling back to static content bank:', e)
      const staticQuiz = await staticProvider.getQuiz(topicIds, count, language)
      return {
        ...staticQuiz,
        notice: 'Served from curated question bank (live AI unreachable).',
      }
    }
  },

  async getFollowups(topicId: string, language: string): Promise<FollowupQA[]> {
    // Curated chips remain accessible in live mode as quick suggestions
    return staticProvider.getFollowups(topicId, language)
  },

  async askLiveFollowup(topicId: string, question: string, language: string): Promise<{ on_topic: boolean; answer: string }> {
    return invokeEdge<{ on_topic: boolean; answer: string }>('followup', {
      topicId,
      question,
      language,
    })
  },
}
