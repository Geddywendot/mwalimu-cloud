import { PRINCIPLES, langName } from './common.ts'

export const EXPLAIN_VERSION = 'explain.v1'
export const explainSystem = PRINCIPLES

export function explainUser(topicTitle: string, topicDescription: string, language: string, level: 'standard' | 'simpler') {
  return `Explain this AZ-900 topic to a beginner.
Topic: ${topicTitle}
Scope: ${topicDescription}
Write in: ${langName(language)}
Level: ${level === 'simpler' ? 'SIMPLER. Use very short sentences, no jargon beyond the key terms, one everyday idea.' : 'standard beginner'}

Return JSON exactly in this shape:
{
  "topic": "string",
  "language": "${language}",
  "simple_explanation": "string, max 120 words",
  "official_definition": "string, accurate, close to how Microsoft Learn defines it",
  "african_analogy": "string, one concrete everyday African scenario mapped to the concept",
  "analogy_limits": "string, where the analogy breaks down",
  "key_terms": [{"term": "string", "meaning": "string"}],
  "exam_tip": "string",
  "common_mistake": "string"
}`
}
