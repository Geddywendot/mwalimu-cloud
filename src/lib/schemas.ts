import { z } from 'zod'

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

export const questionSchema = z
  .object({
    id: z.string(),
    topic_id: z.string(),
    type: z.enum(['single', 'multiple', 'true_false']),
    question: z.string().min(5),
    options: z.array(z.object({ id: z.string(), text: z.string().min(1) })).min(2).max(5),
    correct_option_ids: z.array(z.string()).min(1),
    explanation_correct: z.string().min(1),
    explanation_wrong: z.record(z.string()),
    difficulty: z.enum(['easy', 'medium', 'hard']),
  })
  .refine((q) => q.correct_option_ids.every((id) => q.options.some((o) => o.id === id)), {
    message: 'correct_option_ids must exist in options',
  })

export const settingsSchema = z.object({
  language: z.string().default('en'),
  examDate: z.string().nullable().default(null),
  onboarded: z.boolean().default(false),
})
export type Settings = z.infer<typeof settingsSchema>
