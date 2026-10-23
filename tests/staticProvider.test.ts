import { beforeEach, describe, expect, it } from 'vitest'
import { staticProvider, shuffleQuestionOptions } from '../src/lib/content/staticProvider'
import { TOPICS } from '../src/data/topics'
import { loadProgress, recordAnswer, dueQuestions, exportProgressJson, importProgressJson, emptyProgress, saveProgress } from '../src/lib/progress'
import { computeReadiness } from '../src/lib/readiness'
import { loadSettings, saveSettings } from '../src/lib/settings'

// Mock localStorage and window for headless node test environment
const storageStore = new Map<string, string>()
const mockLocalStorage = {
  getItem: (key: string) => storageStore.get(key) ?? null,
  setItem: (key: string, value: string) => storageStore.set(key, String(value)),
  removeItem: (key: string) => storageStore.delete(key),
  clear: () => storageStore.clear(),
  get length() { return storageStore.size },
  key: (index: number) => Array.from(storageStore.keys())[index] ?? null,
}

if (typeof globalThis.localStorage === 'undefined') {
  Object.defineProperty(globalThis, 'localStorage', {
    value: mockLocalStorage,
    writable: true,
  })
}
if (typeof globalThis.window === 'undefined') {
  Object.defineProperty(globalThis, 'window', {
    value: {
      dispatchEvent: () => true,
    },
    writable: true,
  })
}

describe('staticProvider and offline workflow', () => {
  beforeEach(() => {
    storageStore.clear()
  })

  it('runs guest onboarding and updates local settings with zero backend required', async () => {
    const initial = loadSettings()
    expect(initial.onboarded).toBe(false)
    expect(initial.language).toBe('en')

    await saveSettings({
      language: 'sw',
      examDate: '2026-12-01',
      onboarded: true,
    })

    const updated = loadSettings()
    expect(updated.onboarded).toBe(true)
    expect(updated.language).toBe('sw')
    expect(updated.examDate).toBe('2026-12-01')
  })
  it('loads standard and simpler explanations in English and Swahili for all 15 topics', async () => {
    for (const t of TOPICS) {
      const enStd = await staticProvider.getExplanation(t.id, 'en', 'standard')
      expect(enStd.topic).toBe(t.id)
      expect(enStd.simple_explanation.length).toBeGreaterThan(10)

      const enSimp = await staticProvider.getExplanation(t.id, 'en', 'simpler')
      expect(enSimp.topic).toBe(t.id)

      const swStd = await staticProvider.getExplanation(t.id, 'sw', 'standard')
      expect(swStd.topic).toBe(t.id)
    }
  })

  it('samples 5 questions without repeats in a single session', async () => {
    const res = await staticProvider.getQuiz(['cloud-basics'], 5, 'en')
    expect(res.questions).toHaveLength(5)

    const ids = res.questions.map((q) => q.id)
    const uniqueIds = new Set(ids)
    expect(uniqueIds.size).toBe(5)
  })

  it('correctly maps correct_option_ids and explanation_wrong when options are shuffled', () => {
    const sample = {
      id: 'test-q-1',
      topic_id: 'cloud-basics',
      type: 'single' as const,
      difficulty: 'easy' as const,
      question: 'Test question sample?',
      options: [
        { id: 'A', text: 'Opt A' },
        { id: 'B', text: 'Opt B' },
        { id: 'C', text: 'Opt C' },
        { id: 'D', text: 'Opt D' },
      ],
      correct_option_ids: ['B'],
      explanation_correct: 'B is right',
      explanation_wrong: {
        A: 'A is wrong',
        C: 'C is wrong',
        D: 'D is wrong',
      },
    }

    const shuffled = shuffleQuestionOptions(sample)
    expect(shuffled.options).toHaveLength(4)
    expect(shuffled.correct_option_ids).toHaveLength(1)

    const correctId = shuffled.correct_option_ids[0]
    const correctOpt = shuffled.options.find((o) => o.id === correctId)
    // The text of the correct option must still be 'Opt B'
    expect(correctOpt?.text).toBe('Opt B')

    // All wrong options must have their explanation correctly preserved
    for (const opt of shuffled.options) {
      if (opt.id !== correctId) {
        expect(shuffled.explanation_wrong[opt.id]).toBeDefined()
      }
    }
  })

  it('loads curated follow-up Q&As for topics', async () => {
    const followups = await staticProvider.getFollowups('cloud-basics', 'en')
    expect(followups).toHaveLength(4)
    expect(followups[0].question.length).toBeGreaterThan(5)
  })

  it('runs the end-to-end static flow: answer wrong question -> appears in revision -> updates readiness -> export/import', async () => {
    // Reset progress
    saveProgress(emptyProgress())

    const quizRes = await staticProvider.getQuiz(['cloud-basics'], 5, 'en')
    const q1 = quizRes.questions[0]

    // Answer incorrectly
    const wrongId = q1.options.find((o) => !q1.correct_option_ids.includes(o.id))!.id
    await recordAnswer(q1, [wrongId], false, 2000)

    const pAfter = loadProgress()
    expect(pAfter.attempts).toHaveLength(1)
    expect(pAfter.attempts[0].isCorrect).toBe(false)
    expect(pAfter.review[q1.id].box).toBe(1)

    // Check that wrong answer immediately appears in due questions for revision
    const due = dueQuestions(Date.now() + 1000)
    expect(due.some((q) => q.id === q1.id)).toBe(true)

    // Compute readiness score
    const readiness = computeReadiness(pAfter.attempts)
    expect(readiness.overall).toBe(0) // 1 wrong attempt
    expect(readiness.topics.find((s) => s.topicId === 'cloud-basics')?.attempts).toBe(1)

    // Export progress JSON
    const exported = exportProgressJson()
    expect(exported).toContain(q1.id)

    // Reset and restore
    saveProgress(emptyProgress())
    expect(loadProgress().attempts).toHaveLength(0)

    const importRes = importProgressJson(exported)
    expect(importRes.success).toBe(true)
    expect(loadProgress().attempts).toHaveLength(1)
  })
})
