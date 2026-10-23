import { corsHeaders, json } from '../_shared/cors.ts'
import { admin, runJsonPrompt } from '../_shared/anthropic.ts'
import { callerHash, underLimit } from '../_shared/rateLimit.ts'
import { quizResponseSchema, questionQualityError } from '../_shared/schemas.ts'
import { QUIZ_VERSION, quizSystem, quizUser } from '../_shared/prompts/quiz.v1.ts'

type Row = { id: string; topic_id: string; body: Record<string, unknown>; type: string; difficulty: string }
const toQuestion = (r: Row) => ({ ...r.body, id: r.id, topic_id: r.topic_id, type: r.type, difficulty: r.difficulty })

/** Fallback: random unflagged questions already in the bank. */
async function fromBank(topicIds: string[], count: number) {
  const { data } = await admin().from('questions').select('id, topic_id, body, type, difficulty').in('topic_id', topicIds).eq('flagged', false).limit(100)
  return ((data ?? []) as Row[]).sort(() => Math.random() - 0.5).slice(0, count).map(toQuestion)
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })
  try {
    const { topicIds, count = 5, language = 'en' } = await req.json()
    if (!Array.isArray(topicIds) || topicIds.length === 0 || topicIds.length > 5 || ![5, 10].includes(count)) return json({ error: 'Invalid input' }, 400)

    const db = admin()
    const { data: topics } = await db.from('topics').select('id, title, description').in('id', topicIds)
    if (!topics?.length) return json({ error: 'Unknown topic' }, 404)

    const hash = await callerHash(req)
    if (!(await underLimit(hash))) return json({ questions: await fromBank(topicIds, count), source: 'bank', notice: 'Rate limit reached, showing saved questions.' })

    const perTopic = Math.ceil(count / topics.length)
    try {
      const batches = await Promise.all(topics.map(async (t) => {
        const out = await runJsonPrompt({
          fn: 'generate-quiz', promptVersion: QUIZ_VERSION, callerHash: hash, maxTokens: 4000,
          system: quizSystem, user: quizUser(t.title, t.description ?? '', perTopic, language), schema: quizResponseSchema,
        })
        const good = out.questions.filter((q) => questionQualityError(q) === null)
        const rows = good.map((q) => ({ topic_id: t.id, type: q.type, difficulty: q.difficulty, prompt_version: QUIZ_VERSION, body: { question: q.question, options: q.options, correct_option_ids: q.correct_option_ids, explanation_correct: q.explanation_correct, explanation_wrong: q.explanation_wrong } }))
        if (!rows.length) return []
        const { data, error } = await db.from('questions').insert(rows).select('id, topic_id, body, type, difficulty')
        if (error) throw error
        return (data as Row[]).map(toQuestion)
      }))
      const questions = batches.flat().sort(() => Math.random() - 0.5).slice(0, count)
      if (!questions.length) throw new Error('No valid questions')
      return json({ questions, source: 'ai' })
    } catch (e) {
      console.error('quiz generation failed, using bank', e instanceof Error ? e.message : e)
      const questions = await fromBank(topicIds, count)
      if (!questions.length) return json({ error: 'Could not generate questions and the bank is empty. Please retry.' }, 503)
      return json({ questions, source: 'bank', notice: 'AI is unavailable, showing saved questions.' })
    }
  } catch (e) {
    console.error('generate-quiz failed', e instanceof Error ? e.message : e)
    return json({ error: 'Something went wrong. Please retry.' }, 500)
  }
})
