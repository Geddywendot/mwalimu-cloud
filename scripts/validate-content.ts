import fs from 'node:fs'
import path from 'node:path'
import { z } from 'zod'
import { TOPICS } from '../src/data/topics'

const ROOT = path.resolve(__dirname, '..')
const CONTENT_DIR = path.join(ROOT, 'src', 'content')

// Banned phrases check (case-insensitive)
const BANNED_PATTERNS = [
  /all of the above/i,
  /none of the above/i,
  /all the above/i,
  /none the above/i,
]

// Zod schemas
const keyTermSchema = z.object({
  term: z.string().trim().min(1, 'Key term cannot be empty'),
  meaning: z.string().trim().min(5, 'Key term meaning must be descriptive'),
})

const singleExplanationSchema = z.object({
  topic: z.string(),
  language: z.string(),
  simple_explanation: z.string().trim().min(10),
  official_definition: z.string().trim().min(10),
  african_analogy: z.string().trim().min(10),
  analogy_limits: z.string().trim().min(10),
  key_terms: z.array(keyTermSchema).min(1, 'At least one key term required'),
  exam_tip: z.string().trim().min(5),
  common_mistake: z.string().trim().min(5),
})

const topicLevelsSchema = z.object({
  standard: singleExplanationSchema,
  simpler: singleExplanationSchema,
})

const explanationsEnFileSchema = z.record(topicLevelsSchema)

const explanationsSwFileSchema = z.object({
  _review: z.literal('Needs native-speaker review'),
  topics: z.record(topicLevelsSchema).optional(),
}).passthrough()

const optionSchema = z.object({
  id: z.string().min(1),
  text: z.string().trim().min(1),
})

const questionSchema = z.object({
  id: z.string().regex(/^[a-z0-9-]+$/, 'ID must be lowercase kebab-case (e.g. cloud-basics-001)'),
  topic_id: z.string(),
  type: z.enum(['single', 'multiple', 'true_false']),
  difficulty: z.enum(['easy', 'medium', 'hard']),
  question: z.string().trim().min(10),
  options: z.array(optionSchema),
  correct_option_ids: z.array(z.string()).min(1),
  explanation_correct: z.string().trim().min(10),
  explanation_wrong: z.record(z.string().trim().min(5)),
})

const followupItemSchema = z.object({
  id: z.string().min(1),
  question: z.string().trim().min(5),
  answer: z.string().trim().min(10),
})

export interface ValidationResult {
  valid: boolean
  errors: string[]
  stats: {
    totalTopics: number
    totalQuestions: number
    questionsPerTopic: Record<string, number>
    questionTypes: Record<string, number>
    difficulties: Record<string, number>
    totalFollowupsEn: number
    totalFollowupsSw: number
  }
}

export function validateContent(): ValidationResult {
  const errors: string[] = []
  const expectedTopicIds = TOPICS.map((t) => t.id)

  const stats = {
    totalTopics: expectedTopicIds.length,
    totalQuestions: 0,
    questionsPerTopic: {} as Record<string, number>,
    questionTypes: { single: 0, multiple: 0, true_false: 0 } as Record<string, number>,
    difficulties: { easy: 0, medium: 0, hard: 0 } as Record<string, number>,
    totalFollowupsEn: 0,
    totalFollowupsSw: 0,
  }

  // Helper to count words
  const countWords = (text: string) => text.trim().split(/\s+/).filter(Boolean).length

  // Helper to check banned phrases
  const checkBannedPhrases = (text: string, context: string) => {
    for (const pattern of BANNED_PATTERNS) {
      if (pattern.test(text)) {
        errors.push(`[Banned Phrase] "${pattern.source}" found in ${context}: "${text}"`)
      }
    }
  }

  // 1. Validate explanations.en.json
  const enExplanationsPath = path.join(CONTENT_DIR, 'explanations.en.json')
  if (!fs.existsSync(enExplanationsPath)) {
    errors.push(`File missing: ${enExplanationsPath}`)
  } else {
    try {
      const raw = JSON.parse(fs.readFileSync(enExplanationsPath, 'utf-8'))
      const parsed = explanationsEnFileSchema.safeParse(raw)
      if (!parsed.success) {
        errors.push(`explanations.en.json schema errors: ${JSON.stringify(parsed.error.format())}`)
      } else {
        const data = parsed.data
        for (const topicId of expectedTopicIds) {
          if (!data[topicId]) {
            errors.push(`[Missing Topic in explanations.en.json]: ${topicId}`)
            continue
          }
          for (const level of ['standard', 'simpler'] as const) {
            const item = data[topicId][level]
            if (item.topic !== topicId) {
              errors.push(`[Topic ID Mismatch in explanations.en.json]: expected ${topicId}, got ${item.topic} in level ${level}`)
            }
            if (item.language !== 'en') {
              errors.push(`[Language Mismatch in explanations.en.json]: expected "en", got ${item.language} in ${topicId}/${level}`)
            }
            const words = countWords(item.simple_explanation)
            if (words > 120) {
              errors.push(`[Word Count Exceeded in explanations.en.json]: ${topicId}/${level} simple_explanation has ${words} words (max 120)`)
            }
            checkBannedPhrases(item.simple_explanation, `explanations.en.json ${topicId}/${level} simple_explanation`)
            checkBannedPhrases(item.official_definition, `explanations.en.json ${topicId}/${level} official_definition`)
            checkBannedPhrases(item.african_analogy, `explanations.en.json ${topicId}/${level} african_analogy`)
          }
        }
      }
    } catch (e) {
      errors.push(`Failed to parse explanations.en.json: ${(e as Error).message}`)
    }
  }

  // 2. Validate explanations.sw.json
  const swExplanationsPath = path.join(CONTENT_DIR, 'explanations.sw.json')
  if (!fs.existsSync(swExplanationsPath)) {
    errors.push(`File missing: ${swExplanationsPath}`)
  } else {
    try {
      const raw = JSON.parse(fs.readFileSync(swExplanationsPath, 'utf-8'))
      const parsed = explanationsSwFileSchema.safeParse(raw)
      if (!parsed.success) {
        errors.push(`explanations.sw.json schema errors: ${JSON.stringify(parsed.error.format())}`)
      } else {
        if (raw._review !== 'Needs native-speaker review') {
          errors.push(`[Missing Review Note]: explanations.sw.json must have "_review": "Needs native-speaker review"`)
        }
        // Support either root keys or topics container
        const topicsMap = raw.topics ?? raw
        for (const topicId of expectedTopicIds) {
          const entry = topicsMap[topicId]
          if (!entry || !entry.standard || !entry.simpler) {
            errors.push(`[Missing Topic in explanations.sw.json]: ${topicId}`)
            continue
          }
          for (const level of ['standard', 'simpler'] as const) {
            const item = entry[level]
            if (item.topic !== topicId) {
              errors.push(`[Topic ID Mismatch in explanations.sw.json]: expected ${topicId}, got ${item.topic} in level ${level}`)
            }
            if (item.language !== 'sw') {
              errors.push(`[Language Mismatch in explanations.sw.json]: expected "sw", got ${item.language} in ${topicId}/${level}`)
            }
            const words = countWords(item.simple_explanation)
            if (words > 120) {
              errors.push(`[Word Count Exceeded in explanations.sw.json]: ${topicId}/${level} simple_explanation has ${words} words (max 120)`)
            }
          }
        }
      }
    } catch (e) {
      errors.push(`Failed to parse explanations.sw.json: ${(e as Error).message}`)
    }
  }

  // 3. Validate questions.json
  const questionsPath = path.join(CONTENT_DIR, 'questions.json')
  if (!fs.existsSync(questionsPath)) {
    errors.push(`File missing: ${questionsPath}`)
  } else {
    try {
      const raw = JSON.parse(fs.readFileSync(questionsPath, 'utf-8'))
      if (!Array.isArray(raw)) {
        errors.push(`questions.json root must be an array of questions`)
      } else {
        const seenIds = new Set<string>()
        const seenQuestions = new Set<string>()
        const topicCounts: Record<string, number> = {}

        for (const topicId of expectedTopicIds) {
          topicCounts[topicId] = 0
        }

        for (let idx = 0; idx < raw.length; idx++) {
          const qRaw = raw[idx]
          const parsed = questionSchema.safeParse(qRaw)
          if (!parsed.success) {
            errors.push(`Question at index ${idx} schema errors: ${JSON.stringify(parsed.error.format())}`)
            continue
          }
          const q = parsed.data

          // Duplicate ID check
          if (seenIds.has(q.id)) {
            errors.push(`[Duplicate Question ID]: ${q.id}`)
          }
          seenIds.add(q.id)

          // Duplicate question text check
          const normalizedQText = q.question.toLowerCase().trim()
          if (seenQuestions.has(normalizedQText)) {
            errors.push(`[Duplicate Question Text]: "${q.question}" (id: ${q.id})`)
          }
          seenQuestions.add(normalizedQText)

          // Topic coverage
          if (!expectedTopicIds.includes(q.topic_id)) {
            errors.push(`[Unknown Topic ID in Question ${q.id}]: ${q.topic_id}`)
          } else {
            topicCounts[q.topic_id] = (topicCounts[q.topic_id] || 0) + 1
          }

          // Options check
          const optionIds = q.options.map((o) => o.id)
          const uniqueOptionIds = new Set(optionIds)
          if (uniqueOptionIds.size !== optionIds.length) {
            errors.push(`[Duplicate Option IDs in Question ${q.id}]: ${optionIds.join(', ')}`)
          }

          if (q.type === 'true_false') {
            if (q.options.length !== 2) {
              errors.push(`[True/False Question ${q.id} must have exactly 2 options, found ${q.options.length}`)
            }
          } else {
            if (q.options.length !== 4) {
              errors.push(`[Question ${q.id} type ${q.type} must have 4 options, found ${q.options.length}`)
            }
          }

          // Correct option IDs check
          for (const correctId of q.correct_option_ids) {
            if (!optionIds.includes(correctId)) {
              errors.push(`[Question ${q.id}]: correct_option_id "${correctId}" not found in options [${optionIds.join(', ')}]`)
            }
          }

          // Single type must have 1 correct option
          if ((q.type === 'single' || q.type === 'true_false') && q.correct_option_ids.length !== 1) {
            errors.push(`[Question ${q.id}]: type is "${q.type}" but has ${q.correct_option_ids.length} correct options`)
          }
          // Multiple type must have >= 2 correct options
          if (q.type === 'multiple' && q.correct_option_ids.length < 2) {
            errors.push(`[Question ${q.id}]: type is "multiple" but has only ${q.correct_option_ids.length} correct option`)
          }

          // Wrong option explanation check: EVERY wrong option must have an explanation
          const wrongOptionIds = optionIds.filter((id) => !q.correct_option_ids.includes(id))
          for (const wrongId of wrongOptionIds) {
            if (!q.explanation_wrong[wrongId] || q.explanation_wrong[wrongId].trim().length === 0) {
              errors.push(`[Question ${q.id}]: missing explanation_wrong for option "${wrongId}"`)
            }
          }

          // Banned phrases check in question and all options
          checkBannedPhrases(q.question, `question ${q.id}`)
          for (const opt of q.options) {
            checkBannedPhrases(opt.text, `question ${q.id} option ${opt.id}`)
          }
          checkBannedPhrases(q.explanation_correct, `question ${q.id} explanation_correct`)

          // Tally stats
          stats.totalQuestions++
          stats.questionTypes[q.type] = (stats.questionTypes[q.type] || 0) + 1
          stats.difficulties[q.difficulty] = (stats.difficulties[q.difficulty] || 0) + 1
        }

        stats.questionsPerTopic = topicCounts

        // Check each topic has at least 8 questions
        for (const topicId of expectedTopicIds) {
          const count = topicCounts[topicId] || 0
          if (count < 8) {
            errors.push(`[Insufficient Questions for topic ${topicId}]: found ${count}, required at least 8`)
          }
        }
      }
    } catch (e) {
      errors.push(`Failed to parse questions.json: ${(e as Error).message}`)
    }
  }

  // 4. Validate followups.en.json
  const followupsEnPath = path.join(CONTENT_DIR, 'followups.en.json')
  if (!fs.existsSync(followupsEnPath)) {
    errors.push(`File missing: ${followupsEnPath}`)
  } else {
    try {
      const raw = JSON.parse(fs.readFileSync(followupsEnPath, 'utf-8'))
      for (const topicId of expectedTopicIds) {
        const list = raw[topicId]
        if (!Array.isArray(list)) {
          errors.push(`[Missing Follow-ups in followups.en.json]: topic ${topicId}`)
          continue
        }
        if (list.length !== 4) {
          errors.push(`[Follow-up Count in followups.en.json]: topic ${topicId} has ${list.length} Q&As, expected exactly 4`)
        }
        for (const item of list) {
          const parsed = followupItemSchema.safeParse(item)
          if (!parsed.success) {
            errors.push(`[Invalid follow-up in followups.en.json (${topicId})]: ${JSON.stringify(parsed.error.format())}`)
          } else {
            stats.totalFollowupsEn++
            checkBannedPhrases(item.question, `followups.en.json ${topicId} question`)
            checkBannedPhrases(item.answer, `followups.en.json ${topicId} answer`)
          }
        }
      }
    } catch (e) {
      errors.push(`Failed to parse followups.en.json: ${(e as Error).message}`)
    }
  }

  // 5. Validate followups.sw.json
  const followupsSwPath = path.join(CONTENT_DIR, 'followups.sw.json')
  if (!fs.existsSync(followupsSwPath)) {
    errors.push(`File missing: ${followupsSwPath}`)
  } else {
    try {
      const raw = JSON.parse(fs.readFileSync(followupsSwPath, 'utf-8'))
      if (raw._review !== 'Needs native-speaker review') {
        errors.push(`[Missing Review Note]: followups.sw.json must have "_review": "Needs native-speaker review"`)
      }
      const data = raw.topics ?? raw
      for (const topicId of expectedTopicIds) {
        const list = data[topicId]
        if (!Array.isArray(list)) {
          errors.push(`[Missing Follow-ups in followups.sw.json]: topic ${topicId}`)
          continue
        }
        if (list.length !== 4) {
          errors.push(`[Follow-up Count in followups.sw.json]: topic ${topicId} has ${list.length} Q&As, expected exactly 4`)
        }
        for (const item of list) {
          const parsed = followupItemSchema.safeParse(item)
          if (!parsed.success) {
            errors.push(`[Invalid follow-up in followups.sw.json (${topicId})]: ${JSON.stringify(parsed.error.format())}`)
          } else {
            stats.totalFollowupsSw++
          }
        }
      }
    } catch (e) {
      errors.push(`Failed to parse followups.sw.json: ${(e as Error).message}`)
    }
  }

  return {
    valid: errors.length === 0,
    errors,
    stats,
  }
}

// When executed directly via CLI
if (process.argv[1]?.endsWith('validate-content.ts')) {
  console.log('Running content validation against brief criteria...\n')
  const result = validateContent()

  console.log(`Topics covered: ${result.stats.totalTopics}`)
  console.log(`Total questions: ${result.stats.totalQuestions}`)
  console.log(`Question types:`, result.stats.questionTypes)
  console.log(`Difficulties:`, result.stats.difficulties)
  console.log(`Follow-ups (EN): ${result.stats.totalFollowupsEn}`)
  console.log(`Follow-ups (SW): ${result.stats.totalFollowupsSw}`)

  if (!result.valid) {
    console.error(`\nValidation failed with ${result.errors.length} error(s):`)
    for (const err of result.errors) {
      console.error(`  - ${err}`)
    }
    process.exit(1)
  }

  console.log('\nAll content validation checks PASSED perfectly!')
  process.exit(0)
}
