import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { LANGUAGES, loadSettings, saveSettings } from '../lib/settings'

export default function Onboarding() {
  const nav = useNavigate()
  const [language, setLanguage] = useState(loadSettings().language)
  const [examDate, setExamDate] = useState(loadSettings().examDate ?? '')

  const done = async () => {
    await saveSettings({ language, examDate: examDate || null, onboarded: true })
    nav('/topics')
  }

  return (
    <div className="panel mx-auto max-w-md space-y-5">
      <h1 className="text-2xl">Set up your study buddy</h1>
      <div>
        <label htmlFor="lang" className="mb-1 block font-semibold">Explanations in</label>
        <select id="lang" value={language} onChange={(e) => setLanguage(e.target.value)} className="w-full rounded-lg border border-ink/20 px-3 py-2.5">
          {LANGUAGES.map((l) => <option key={l.code} value={l.code}>{l.label}</option>)}
        </select>
        <p className="mt-1 text-sm text-ink/60">Azure terms stay in English so they match the exam.</p>
      </div>
      <div>
        <label htmlFor="date" className="mb-1 block font-semibold">Exam date (optional)</label>
        <input id="date" type="date" value={examDate} min={new Date().toISOString().slice(0, 10)} onChange={(e) => setExamDate(e.target.value)} className="w-full rounded-lg border border-ink/20 px-3 py-2.5" />
      </div>
      <button className="btn-primary w-full" onClick={done}>Start learning</button>
    </div>
  )
}
