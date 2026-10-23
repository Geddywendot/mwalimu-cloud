# Prompts

All prompts live in `supabase/functions/_shared/prompts/` and are versioned (`*.v1.ts`). Changing a prompt means a new version file, and the version is stored with the output and in `ai_logs`.

## Shared principles (`common.ts`)
Accuracy over guessing, grade-8 language, Azure terms kept in English, respectful African analogies, analogy never replaces the definition, no real exam questions, JSON only.
**Why:** the exam rewards precise terms, so the analogy is an add-on, not a substitute. JSON-only output makes validation reliable.

## explain.v1
- **Purpose:** beginner explanation with analogy.
- **Input:** topic title and scope (from the DB), language, level (standard or simpler).
- **Output schema:** `topic, language, simple_explanation (max 120 words), official_definition, african_analogy, analogy_limits, key_terms[], exam_tip, common_mistake`.
- **Rationale:** `analogy_limits` forces honesty about where the metaphor fails, which prevents misconceptions. Scope text keeps the model inside the skills outline.
- **Example output (abridged):** topic "Benefits of cloud services": analogy "A matatu route adds vehicles at rush hour and sends them home at midday" mapped to elasticity, with the limit "unlike matatus, cloud scaling can be automatic and takes seconds".

## quiz.v1
- **Purpose:** original practice questions with full explanations.
- **Rules in prompt:** one concept per question, scenario wording, mixed difficulty and types, 4 plausible options, no "all of the above", an explanation for EVERY wrong option, never copy exam questions.
- **Output schema:** `{questions:[{type, question, options[], correct_option_ids[], explanation_correct, explanation_wrong{}, difficulty}]}`.
- **Code gates (`schemas.ts`):** unique option ids, correct ids exist, type/answer-count consistency, banned phrases, explanation for each wrong option.

## followup.v1
- **Purpose:** topic-locked Q&A.
- **Rationale:** the system prompt treats learner text as a question, not instructions (prompt-injection resistance). Off-topic returns `on_topic:false` with a polite redirect.

## Reliability pipeline
Parse JSON, validate with Zod, retry once with the validation error appended, then fall back to the question bank. Logged: version, model, latency, tokens, success.
