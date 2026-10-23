import { settingsSchema, type Settings } from './schemas'
import { supabase } from './supabase'

const KEY = 'mwalimu.settings.v1'

/** Languages are data-driven: add an entry here, a JSON file in i18n/, and a name in the Edge Function prompts. */
export const LANGUAGES = [
  { code: 'en', label: 'English' },
  { code: 'sw', label: 'Kiswahili' },
]

export function loadSettings(): Settings {
  try { return settingsSchema.parse(JSON.parse(localStorage.getItem(KEY) ?? '{}')) } catch { return settingsSchema.parse({}) }
}

export async function saveSettings(s: Settings): Promise<void> {
  localStorage.setItem(KEY, JSON.stringify(s))
  window.dispatchEvent(new Event('mwalimu:settings'))
  try {
    const { data } = (await supabase?.auth.getSession()) ?? { data: { session: null } }
    if (data.session) await supabase!.from('profiles').upsert({ id: data.session.user.id, language: s.language, exam_date: s.examDate })
  } catch { /* offline */ }
}
