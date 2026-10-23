# Prompts Specification & Content Engineering

This document documents both:
1. **The Prompts Used to Create the Pre-Authored Curated Bank** (`src/content/`)
2. **The Live-Mode Runtime Prompts** (`supabase/functions/_shared/prompts/`)

---

## 1. Prompts Used to Author the Curated Content Bank

### A. Explanations Authoring Prompt (`explanations.v1`)
- **Version:** `content-authoring-explain-v1.0`
- **Model Used:** Gemini 1.5 Pro / Claude 3.5 Sonnet (offline authoring pipeline)
- **Target Schema:**
  ```json
  {
    "topic": "string",
    "language": "en | sw",
    "level": "standard | simpler",
    "simple_explanation": "string (<= 120 words)",
    "official_definition": "string",
    "african_analogy": "string",
    "analogy_limits": "string",
    "key_terms": [{ "term": "string", "meaning": "string" }],
    "exam_tip": "string",
    "common_mistake": "string"
  }
  ```
- **Rationale & Guardrails:**
  - `simple_explanation` is strictly capped at 120 words to ensure rapid readability on small mobile screens.
  - `analogy_limits` is mandatory to avoid superficial metaphors replacing technical truth.
  - African cultural grounding (matatus, M-Pesa agents, prepaid electricity tokens, SACCOs, agricultural collectives) ensures cultural familiarity.
  - Azure terminology remains in English in all languages to match official Pearson VUE exam vouchers.

### B. Questions Authoring Prompt (`questions.v1`)
- **Version:** `content-authoring-quiz-v1.0`
- **Output Schema:**
  ```json
  {
    "id": "string (kebab-case)",
    "topic_id": "string",
    "type": "single | multiple | true_false",
    "difficulty": "easy | medium | hard",
    "question": "string",
    "options": [{ "id": "string", "text": "string" }],
    "correct_option_ids": ["string"],
    "explanation_correct": "string",
    "explanation_wrong": { "optionId": "string" }
  }
  ```
- **Rationale & Review Controls:**
  - One concept per item to avoid confusing compound negatives.
  - No "all of the above" or "none of the above".
  - Explanations for every single wrong option to maximize educational value from incorrect answers.
  - Randomized option positions across A, B, C, D to prevent position bias.

### C. Follow-up Q&A Authoring Prompt (`followups.v1`)
- **Version:** `content-authoring-followups-v1.0`
- **Output:** Exactly 4 curated beginner questions and answers per topic, clarifying common student pitfalls.

---

## 2. Live-Mode Runtime Prompts (`supabase/functions/_shared/prompts/`)

When `VITE_CONTENT_MODE=live` is configured, Edge Functions invoke Claude using the versioned prompts stored in `supabase/functions/_shared/prompts/`:

### A. `explain.v1.ts` (`EXPLAIN_VERSION = 'v1'`)
- **System Prompt:** Sets persona as an encouraging, technically precise tutor who uses African everyday analogies. Prohibits preamble or non-JSON output.
- **User Prompt:** Takes `topic.title`, `topic.description`, `language`, and `level` ('standard' or 'simpler').
- **Zod Schema:** Validates output structure with `explanationSchema`.
- **Retry Mechanism:** On validation failure, re-prompts once with the specific Zod error appended. On secondary failure, serves cached database explanation.

### B. `quiz.v1.ts` (`QUIZ_VERSION = 'v1'`)
- **System Prompt:** Instructs Claude to author original scenario-based practice questions. Prohibits exam brain dumps, real exam leaks, or "all of the above" phrases.
- **Dynamic Sampling:** Fallback directly routes to the local curated question bank if rate limits are reached (30 calls/hr).

### C. `followup.v1.ts` (`FOLLOWUP_VERSION = 'v1'`)
- **Prompt Injection Defense:** Treats user inputs strictly as conversational student questions rather than developer system instructions.
- **Topic Lock:** If the question strays outside the current AZ-900 topic, returns `{"on_topic": false, "answer": "Let's stick to our Azure topic..."}`.

---

## 3. Human Review Process Applied to Curated Content

1. **Spot-Checking:** Questions and explanations were audited against the official Microsoft Learn AZ-900 Study Guide (last updated 2026).
2. **Automated Content Validation:** Every JSON content file passes through `scripts/validate-content.ts` (Zod schema checking, word count verification, banned phrase detection, and option completeness).
3. **Translation Flag:** Kiswahili text is tagged with `"_review": "Needs native-speaker review"` and displayed with a UI disclaimer banner.
