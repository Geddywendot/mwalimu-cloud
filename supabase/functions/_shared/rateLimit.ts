import { admin, sha256 } from './anthropic.ts'

export const LIMIT_PER_HOUR = 30

/** Identify the caller without storing personal data: hash of user id (or IP for guests). */
export async function callerHash(req: Request): Promise<string> {
  const token = req.headers.get('authorization')?.replace('Bearer ', '')
  let id = req.headers.get('x-forwarded-for') ?? 'unknown'
  try {
    const payload = JSON.parse(atob(token!.split('.')[1]))
    if (payload.sub && payload.role === 'authenticated') id = payload.sub
  } catch { /* guest or malformed: fall back to IP */ }
  return sha256(id)
}

/** True if the caller is still under LIMIT_PER_HOUR AI calls in the last hour. */
export async function underLimit(hash: string): Promise<boolean> {
  const since = new Date(Date.now() - 3_600_000).toISOString()
  const { count } = await admin().from('ai_logs').select('id', { count: 'exact', head: true }).eq('caller_hash', hash).gte('created_at', since)
  return (count ?? 0) < LIMIT_PER_HOUR
}
