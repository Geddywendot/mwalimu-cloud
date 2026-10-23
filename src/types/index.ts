/** Question interaction types supported by the quiz engine. */
export type QuestionType = 'single' | 'multiple' | 'true_false'

/** Question difficulty level for progression tracking. */
export type Difficulty = 'easy' | 'medium' | 'hard'

/** An individual selectable option for a question. */
export interface Option {
  id: string
  text: string
}

/** Complete question definition in the question bank. */
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

/** A core vocabulary term and its concise definition. */
export interface KeyTerm {
  term: string
  meaning: string
}

/** Rich explanation payload for an AZ-900 topic. */
export interface Explanation {
  topic: string
  language: string
  simple_explanation: string
  official_definition: string
  african_analogy: string
  analogy_limits: string
  key_terms: KeyTerm[]
  exam_tip: string
  common_mistake: string
}

/** A curated follow-up question and answer pair. */
export interface FollowupQA {
  id: string
  question: string
  answer: string
}

/** Logged attempt of an answered question. */
export interface Attempt {
  questionId: string
  topicId: string
  isCorrect: boolean
  at: number
}

/** Spaced repetition Leitner state for an individual question. */
export interface ReviewState {
  box: number
  dueAt: number
  lastReviewedAt: number
}

/** AZ-900 syllabus topic item. */
export interface Topic {
  id: string
  domainId: string
  title: string
  description: string
}

/** AZ-900 syllabus domain grouping. */
export interface Domain {
  id: string
  title: string
  weight: number
}

/** Abstract content provider interface supplying explanations, quizzes, and follow-ups. */
export interface ContentProvider {
  /** Retrieves an explanation for a topic in standard or simpler wording. */
  getExplanation(topicId: string, language: string, level: 'standard' | 'simpler'): Promise<Explanation>
  /** Samples a set of quiz questions for the specified topics. */
  getQuiz(topicIds: string[], count: 5 | 10, language: string): Promise<{ questions: Question[]; notice?: string }>
  /** Retrieves curated follow-up question and answer pairs for a topic. */
  getFollowups(topicId: string, language: string): Promise<FollowupQA[]>
  /** Optional free-text follow-up for live AI mode. */
  askLiveFollowup?(topicId: string, question: string, language: string): Promise<{ on_topic: boolean; answer: string }>
}
