export type QuestionType = 'single' | 'multiple' | 'true_false'
export type Difficulty = 'easy' | 'medium' | 'hard'

export interface Option { id: string; text: string }

export interface Question {
  id: string
  topic_id: string
  type: QuestionType
  question: string
  options: Option[]
  correct_option_ids: string[]
  explanation_correct: string
  explanation_wrong: Record<string, string>
  difficulty: Difficulty
}

export interface Explanation {
  topic: string
  language: string
  simple_explanation: string
  official_definition: string
  african_analogy: string
  analogy_limits: string
  key_terms: { term: string; meaning: string }[]
  exam_tip: string
  common_mistake: string
}

export interface Attempt { questionId: string; topicId: string; isCorrect: boolean; at: number }
export interface ReviewState { box: number; dueAt: number; lastReviewedAt: number }
export interface Topic { id: string; domainId: string; title: string; description: string }
export interface Domain { id: string; title: string; weight: number }
