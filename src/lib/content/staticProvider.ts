import explanationsEn from '../../content/explanations.en.json'
import explanationsSw from '../../content/explanations.sw.json'
import questionsData from '../../content/questions.json'
import followupsEn from '../../content/followups.en.json'
import followupsSw from '../../content/followups.sw.json'
import type { ContentProvider, Explanation, FollowupQA, Option, Question } from '../../types'

interface TopicLevelData {
  standard: Explanation
  simpler: Explanation
}

const enExplanations = explanationsEn as unknown as Record<string, TopicLevelData>
const swExplanations = ((explanationsSw as Record<string, unknown>).topics ?? explanationsSw) as unknown as Record<string, TopicLevelData>
const allQuestions = questionsData as Question[]
const enFollowups = followupsEn as Record<string, FollowupQA[]>
const swFollowups = ((followupsSw as Record<string, unknown>).topics ?? followupsSw) as Record<string, FollowupQA[]>

/** Fisher-Yates array shuffle returning a new array copy. */
function shuffle<T>(array: readonly T[]): T[] {
  const result = [...array]
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    const temp = result[i]
    result[i] = result[j]
    result[j] = temp
  }
  return result
}

/**
 * Shuffles question options while cleanly remapping labels (A, B, C, D)
 * and updating correct_option_ids and explanation_wrong accordingly.
 */
export function shuffleQuestionOptions(q: Question): Question {
  if (q.type === 'true_false') {
    // Preserve standard True/False order for UX clarity
    return { ...q, options: [...q.options] }
  }

  const shuffledOriginal = shuffle(q.options)
  const letters = ['A', 'B', 'C', 'D', 'E'].slice(0, shuffledOriginal.length)
  const oldToNew = new Map<string, string>()

  const newOptions: Option[] = shuffledOriginal.map((opt, idx) => {
    const newId = letters[idx]
    oldToNew.set(opt.id, newId)
    return { id: newId, text: opt.text }
  })

  const newCorrectIds = q.correct_option_ids
    .map((oldId) => oldToNew.get(oldId))
    .filter((id): id is string => Boolean(id))

  const newExplanationWrong: Record<string, string> = {}
  for (const [oldId, explanation] of Object.entries(q.explanation_wrong)) {
    const newId = oldToNew.get(oldId)
    if (newId) {
      newExplanationWrong[newId] = explanation
    }
  }

  return {
    ...q,
    options: newOptions,
    correct_option_ids: newCorrectIds,
    explanation_wrong: newExplanationWrong,
  }
}

/**
 * Static in-memory content provider serving pre-authored AZ-900 content
 * with zero network latency and full offline support.
 */
export const staticProvider: ContentProvider = {
  async getExplanation(topicId: string, language: string, level: 'standard' | 'simpler'): Promise<Explanation> {
    const store = language === 'sw' ? swExplanations : enExplanations
    const fallbackStore = enExplanations

    const topicData = store[topicId] ?? fallbackStore[topicId]
    if (!topicData) {
      throw new Error(`Topic not found: ${topicId}`)
    }

    const explanation = topicData[level] ?? topicData.standard
    return { ...explanation }
  },

  async getQuiz(topicIds: string[], count: 5 | 10, _language: string): Promise<{ questions: Question[]; notice?: string }> {
    let pool: Question[] = []

    if (!topicIds.length || topicIds.includes('mixed')) {
      pool = allQuestions
    } else {
      pool = allQuestions.filter((q) => topicIds.includes(q.topic_id))
    }

    if (pool.length === 0) {
      pool = allQuestions
    }

    // Shuffle pool to ensure varied question sampling without repeats within the session
    const shuffledPool = shuffle(pool)
    const sampled = shuffledPool.slice(0, count)

    // Shuffle option positions on each sampled question
    const questions = sampled.map(shuffleQuestionOptions)

    return {
      questions,
      notice: undefined,
    }
  },

  async getFollowups(topicId: string, language: string): Promise<FollowupQA[]> {
    const store = language === 'sw' ? swFollowups : enFollowups
    const fallbackStore = enFollowups

    const list = store[topicId] ?? fallbackStore[topicId] ?? []
    return list.map((item) => ({ ...item }))
  },
}
