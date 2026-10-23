import { corsHeaders, json } from '../_shared/cors.ts'
import { admin, runJsonPrompt } from '../_shared/anthropic.ts'
import { callerHash, underLimit } from '../_shared/rateLimit.ts'
import { followupResponseSchema } from '../_shared/schemas.ts'
import { FOLLOWUP_VERSION, followupSystem, followupUser } from '../_shared/prompts/followup.v1.ts'

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })
  try {
    const { topicId, question, language = 'en' } = await req.json()
    if (typeof topicId !== 'string' || typeof question !== 'string' || question.trim().length < 3 || question.length > 500) return json({ error: 'Invalid input' }, 400)
    const { data: topic } = await admin().from('topics').select('title').eq('id', topicId).maybeSingle()
    if (!topic) return json({ error: 'Unknown topic' }, 404)
    const hash = await callerHash(req)
    if (!(await underLimit(hash))) return json({ error: 'Rate limit reached. Try again in a bit.' }, 429)
    const out = await runJsonPrompt({
      fn: 'followup', promptVersion: FOLLOWUP_VERSION, callerHash: hash, maxTokens: 800,
      system: followupSystem, user: followupUser(topic.title, question.trim(), language), schema: followupResponseSchema,
    })
    return json(out)
  } catch (e) {
    console.error('followup failed', e instanceof Error ? e.message : e)
    return json({ error: 'Could not answer right now. Please retry.' }, 500)
  }
})
