import { explanationSchema, questionSchema } from './schemas'
import { supabase } from './supabase'
import type { Explanation, Question } from '../types'

async function invoke<T>(fn: string, body: Record<string, unknown>): Promise<T> {
  if (!supabase) throw new Error('Backend not configured. Add your Supabase keys to .env.')
  const { data, error } = await supabase.functions.invoke(fn, { body })
  if (error) {
    // Try to surface the server's friendly message
    let msg = 'Request failed. Check your connection and retry.'
    try { msg = (await (error as { context: Response }).context.json()).error ?? msg } catch { /* keep default */ }
    throw new Error(msg)
  }
  return data as T
}

export async function fetchExplanation(topicId: string, language: string, simpler: boolean): Promise<Explanation> {
  const res = await invoke<{ explanation: unknown }>('explain', { topicId, language, level: simpler ? 'simpler' : 'standard' })
  return explanationSchema.parse(res.explanation)
}

export async function fetchQuiz(topicIds: string[], count: 5 | 10, language: string): Promise<{ questions: Question[]; notice?: string }> {
  const res = await invoke<{ questions: unknown[]; notice?: string }>('generate-quiz', { topicIds, count, language })
  const questions = res.questions.map((q) => questionSchema.parse(q)) as Question[]
  return { questions, notice: res.notice }
}

export async function askFollowup(topicId: string, question: string, language: string) {
  return invoke<{ on_topic: boolean; answer: string }>('followup', { topicId, question, language })
}

export async function flagQuestion(id: string) {
  await supabase?.rpc('flag_question', { qid: id })
}
