import { PRINCIPLES, langName } from './common.ts'

export const QUIZ_VERSION = 'quiz.v1'
export const quizSystem = PRINCIPLES

export function quizUser(topicTitle: string, topicDescription: string, count: number, language: string) {
  return `Write ${count} ORIGINAL AZ-900 practice questions.
Topic: ${topicTitle}
Scope: ${topicDescription}
Language: ${langName(language)} (keep Azure terms in English)

Rules:
- Exactly one concept per question. Scenario-based wording where possible.
- Mix difficulty (easy, medium, hard) and types (mostly "single", some "true_false", at most one "multiple").
- "single": 4 plausible options, exactly 1 correct. "multiple": 4-5 options, 2+ correct, and say "Select all that apply" in the question. "true_false": options A="True", B="False".
- Option ids are "A", "B", "C"...
- No "all of the above" / "none of the above". No trick wording.
- explanation_correct says WHY the right answer is right. explanation_wrong has one entry for EVERY incorrect option id saying why it is wrong.
- Do not copy or paraphrase real exam questions.

Return JSON exactly:
{"questions":[{"type":"single|multiple|true_false","question":"string","options":[{"id":"A","text":"string"}],"correct_option_ids":["A"],"explanation_correct":"string","explanation_wrong":{"B":"string"},"difficulty":"easy|medium|hard"}]}`
}
