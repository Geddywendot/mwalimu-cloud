import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0'
import type { ZodTypeAny, z } from 'https://esm.sh/zod@3.23.8'

export const MODEL = Deno.env.get('ANTHROPIC_MODEL') ?? 'claude-sonnet-5-5'

/** Service-role client. Only ever used inside Edge Functions. */
export const admin = () =>
  createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!)

export async function sha256(text: string): Promise<string> {
  const salt = Deno.env.get('LOG_SALT') ?? 'mwalimu'
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(salt + text))
  return [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, '0')).join('')
}

interface CallResult { text: string; tokensIn: number; tokensOut: number; latencyMs: number }

async function callClaude(system: string, user: string, maxTokens: number): Promise<CallResult> {
  const started = Date.now()
  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    signal: AbortSignal.timeout(45_000),
    headers: {
      'content-type': 'application/json',
      'x-api-key': Deno.env.get('ANTHROPIC_API_KEY')!,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({ model: MODEL, max_tokens: maxTokens, system, messages: [{ role: 'user', content: user }] }),
  })
  if (!res.ok) throw new Error(`Anthropic API ${res.status}`)
  const data = await res.json()
  const text = (data.content ?? []).filter((b: { type: string }) => b.type === 'text').map((b: { text: string }) => b.text).join('')
  return { text, tokensIn: data.usage?.input_tokens ?? 0, tokensOut: data.usage?.output_tokens ?? 0, latencyMs: Date.now() - started }
}

/** Pull the JSON object out of a model reply, tolerating stray fences or prose. */
export function extractJson(text: string): unknown {
  const start = text.indexOf('{')
  const end = text.lastIndexOf('}')
  if (start === -1 || end === -1) throw new Error('No JSON object in reply')
  return JSON.parse(text.slice(start, end + 1))
}

/**
 * Call Claude, parse + validate JSON with Zod. On failure retry ONCE with the error appended.
 * Logs every attempt (no personal data) to ai_logs.
 */
export async function runJsonPrompt<S extends ZodTypeAny>(opts: {
  fn: string; promptVersion: string; callerHash: string; system: string; user: string; schema: S; maxTokens?: number
}): Promise<z.infer<S>> {
  const db = admin()
  let user = opts.user
  let lastError = ''
  for (let attempt = 0; attempt < 2; attempt++) {
    let r: CallResult | null = null
    try {
      r = await callClaude(opts.system, user, opts.maxTokens ?? 2500)
      const parsed = opts.schema.parse(extractJson(r.text))
      await db.from('ai_logs').insert({ function_name: opts.fn, caller_hash: opts.callerHash, prompt_version: opts.promptVersion, model: MODEL, latency_ms: r.latencyMs, tokens_in: r.tokensIn, tokens_out: r.tokensOut, success: true })
      return parsed
    } catch (e) {
      lastError = e instanceof Error ? e.message : String(e)
      await db.from('ai_logs').insert({ function_name: opts.fn, caller_hash: opts.callerHash, prompt_version: opts.promptVersion, model: MODEL, latency_ms: r?.latencyMs ?? null, tokens_in: r?.tokensIn ?? null, tokens_out: r?.tokensOut ?? null, success: false })
      user = `${opts.user}\n\nYour previous reply was invalid: ${lastError.slice(0, 400)}\nReturn ONLY corrected valid JSON.`
    }
  }
  throw new Error(`AI output invalid after retry: ${lastError}`)
}
