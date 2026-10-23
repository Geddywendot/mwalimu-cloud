import { z } from 'https://esm.sh/zod@3.23.8'

export const explanationSchema = z.object({
  topic: z.string(),
  language: z.string(),
  simple_explanation: z.string().min(1),
  official_definition: z.string().min(1),
  african_analogy: z.string().min(1),
  analogy_limits: z.string().min(1),
  key_terms: z.array(z.object({ term: z.string(), meaning: z.string() })),
  exam_tip: z.string().min(1),
  common_mistake: z.string().min(1),
})

export const aiQuestionSchema = z.object({
  type: z.enum(['single', 'multiple', 'true_false']),
  question: z.string().min(5),
  options: z.array(z.object({ id: z.string(), text: z.string().min(1) })).min(2).max(5),
  correct_option_ids: z.array(z.string()).min(1),
  explanation_correct: z.string().min(1),
  explanation_wrong: z.record(z.string()),
  difficulty: z.enum(['easy', 'medium', 'hard']),
})
export const quizResponseSchema = z.object({ questions: z.array(aiQuestionSchema).min(1) })
export type AiQuestion = z.infer<typeof aiQuestionSchema>

export const followupResponseSchema = z.object({ on_topic: z.boolean(), answer: z.string().min(1) })

/** Quality gates beyond the schema. Returns an error string, or null if the question is fine. */
export function questionQualityError(q: AiQuestion): string | null {
  const ids = q.options.map((o) => o.id)
  if (new Set(ids).size !== ids.length) return 'duplicate option ids'
  if (!q.correct_option_ids.every((id) => ids.includes(id))) return 'correct id not in options'
  if (q.type === 'single' && q.correct_option_ids.length !== 1) return 'single must have exactly one answer'
  if (q.type === 'multiple' && q.correct_option_ids.length < 2) return 'multiple needs 2+ answers'
  if (q.type === 'true_false' && q.options.length !== 2) return 'true_false needs 2 options'
  if (q.options.some((o) => /all of the above|none of the above/i.test(o.text))) return 'banned option text'
  const wrongIds = ids.filter((id) => !q.correct_option_ids.includes(id))
  if (wrongIds.some((id) => !q.explanation_wrong[id]?.trim())) return 'missing explanation for a wrong option'
  return null
}
