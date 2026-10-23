import { useEffect, useState } from 'react'
import en from '../i18n/en.json'
import sw from '../i18n/sw.json'
import { loadSettings } from '../lib/settings'

const dict: Record<string, Record<string, string>> = { en, sw }

/** Settings + translator. Re-renders when settings change anywhere in the app. */
export function useSettings() {
  const [settings, setSettings] = useState(loadSettings)
  useEffect(() => {
    const sync = () => setSettings(loadSettings())
    window.addEventListener('mwalimu:settings', sync)
    return () => window.removeEventListener('mwalimu:settings', sync)
  }, [])
  const t = (key: string) => dict[settings.language]?.[key] ?? dict.en[key] ?? key
  return { settings, t }
}
