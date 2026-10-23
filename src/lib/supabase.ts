import { createClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL as string | undefined
const anon = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined

/** Only the public anon key lives in the browser. Data is protected by RLS. */
export const supabase = url && anon ? createClient(url, anon) : null
export const hasBackend = supabase !== null
