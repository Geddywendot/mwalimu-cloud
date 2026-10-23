import { corsHeaders, json } from '../_shared/cors.ts'
import { admin, runJsonPrompt } from '../_shared/anthropic.ts'
import { callerHash, underLimit } from '../_shared/rateLimit.ts'
import { explanationSchema } from '../_shared/schemas.ts'
import { EXPLAIN_VERSION, explainSystem, explainUser } from '../_shared/prompts/explain.v1.ts'

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })
  try {
    const { topicId, language = 'en', level = 'standard' } = await req.json()
    if (typeof topicId !== 'string' || !['standard', 'simpler'].includes(level) || typeof language !== 'string' || language.length > 5) {
      return json({ error: 'Invalid input' }, 400)
    }
    const db = admin()
    const { data: topic } = await db.from('topics').select('title, description').eq('id', topicId).maybeSingle()
    if (!topic) return json({ error: 'Unknown topic' }, 404)

    const { data: cached } = await db.from('explanations').select('content').eq('topic_id', topicId).eq('language', language).eq('level', level).maybeSingle()
    if (cached) return json({ explanation: cached.content, cached: true })

    const hash = await callerHash(req)
    if (!(await underLimit(hash))) return json({ error: 'Rate limit reached. Try again in a bit.' }, 429)

    const explanation = await runJsonPrompt({
      fn: 'explain', promptVersion: EXPLAIN_VERSION, callerHash: hash,
      system: explainSystem, user: explainUser(topic.title, topic.description ?? '', language, level), schema: explanationSchema,
    })
    await db.from('explanations').upsert({ topic_id: topicId, language, level, content: explanation, prompt_version: EXPLAIN_VERSION }, { onConflict: 'topic_id,language,level' })
    return json({ explanation, cached: false })
  } catch (e) {
    console.error('explain failed', e instanceof Error ? e.message : e)
    return json({ error: 'Could not generate the explanation. Please retry.' }, 500)
  }
})
