# Content Generation Guide for Mwalimu Cloud Maintainers

This guide provides copy-paste ready prompts and review checklists that maintainers can use with any free AI chat assistant (such as Claude Free, ChatGPT, or Gemini) to author new topics, questions, or follow-ups for Mwalimu Cloud.

---

## 1. Explanation Generation Prompt

**Role & Instructions:**  
Copy and paste the prompt below into a free AI chat assistant to generate an explanation for any new AZ-900 topic:

```markdown
You are a senior Azure curriculum engineer and educator helping beginners in Africa prepare for the Microsoft Azure Fundamentals (AZ-900) exam.

Generate an explanation JSON object for the following AZ-900 topic:
Topic ID: [e.g. arch-compute]
Topic Title: [e.g. Compute services]
Topic Scope: [e.g. Virtual machines, scale sets, App Service, Functions, AVD, containers]
Target Language: [en or sw]
Level: [standard or simpler]

Strict constraints:
1. Return strictly valid JSON with no markdown wrapping or preamble.
2. simple_explanation must be UNDER 120 words.
3. african_analogy must use widely understood, respectful African analogies (matatus, mobile money/M-Pesa kiosks, prepaid electricity/airtime tokens, SACCOs, water boreholes, shamba ownership, village compounds).
4. analogy_limits must explicitly explain where the analogy breaks down technically.
5. All Azure technical names (Virtual Machines, App Service, etc.) MUST stay in English, even if the language is Kiswahili.
6. Provide accurate exam tips and common pitfalls based strictly on the official Microsoft Learn skills outline.

JSON Schema:
{
  "topic": "[topic-id]",
  "language": "[en|sw]",
  "simple_explanation": "[Clear explanation under 120 words]",
  "official_definition": "[Formal definition reflecting Microsoft documentation]",
  "african_analogy": "[Respectful, relatable African analogy]",
  "analogy_limits": "Where it breaks down: [Specific technical difference]",
  "key_terms": [
    { "term": "[Azure term in English]", "meaning": "[Clear definition]" }
  ],
  "exam_tip": "[Actionable AZ-900 test strategy]",
  "common_mistake": "[Frequent student misconception to avoid]"
}
```

---

## 2. Question Bank Generation Prompt

Copy and paste this prompt to generate 8 original practice questions for a topic:

```markdown
You are an expert exam item author creating original practice questions for Microsoft Azure Fundamentals (AZ-900).

Topic ID: [e.g. arch-storage]
Topic Name: [e.g. Storage services]
Key Concepts: [Blob, Files, Disks, Access Tiers (Hot/Cool/Cold/Archive), Redundancy (LRS/ZRS/GRS)]

Write 8 original practice questions adhering to these strict quality gates:
1. Questions must test one single concept clearly. Prefer practical scenarios.
2. Mix types: 4-5 "single", 2 "multiple" (2 correct options), 1-2 "true_false" (2 options).
3. Mix difficulties: 3 "easy", 3 "medium", 2 "hard".
4. For single and multiple, provide exactly 4 plausible options (A, B, C, D). For true_false, provide exactly 2 options (A: True, B: False).
5. BANNED: Never use "all of the above", "none of the above", or trick negative phrasing.
6. Vary correct answer positions (do NOT always place the correct answer at A or B).
7. Provide a detailed explanation_correct.
8. CRITICAL: Provide explanation_wrong for EVERY single incorrect option ID explaining why it is wrong.
9. Stable IDs formatted as: [topic-id]-001 through [topic-id]-008.

Return strictly a JSON array of 8 Question objects:
[
  {
    "id": "[topic-id]-001",
    "topic_id": "[topic-id]",
    "type": "single",
    "difficulty": "medium",
    "question": "[Scenario question text]",
    "options": [
      { "id": "A", "text": "[Option text]" },
      { "id": "B", "text": "[Option text]" },
      { "id": "C", "text": "[Option text]" },
      { "id": "D", "text": "[Option text]" }
    ],
    "correct_option_ids": ["C"],
    "explanation_correct": "[Why C is correct]",
    "explanation_wrong": {
      "A": "[Why A is incorrect]",
      "B": "[Why B is incorrect]",
      "D": "[Why D is incorrect]"
    }
  }
]
```

---

## 3. Curated Follow-Up Q&As Generation Prompt

```markdown
Generate exactly 4 high-yield Q&A pairs that beginners commonly ask about this AZ-900 topic:
Topic ID: [e.g. arch-identity]
Language: [en or sw]

Strict rules:
- Focus on practical, real-world questions that clarify edge cases or comparisons.
- Clear, educational answers between 30 and 80 words.
- In Swahili, keep technical Azure terms in English.

JSON Schema:
[
  {
    "id": "[topic-id]-f01",
    "question": "[Common beginner question]",
    "answer": "[Clear educational answer]"
  },
  { "id": "[topic-id]-f02", "question": "...", "answer": "..." },
  { "id": "[topic-id]-f03", "question": "...", "answer": "..." },
  { "id": "[topic-id]-f04", "question": "...", "answer": "..." }
]
```

---

## 4. Maintainer Pre-Commit Review Checklist

Before committing generated content to `src/content/`:

- [ ] **Technical Grounding:** Verify all facts against the current Microsoft Learn AZ-900 syllabus. If pricing or limits change often, avoid hardcoded numbers.
- [ ] **Word Count:** Verify that `simple_explanation` is $\le 120$ words.
- [ ] **Analogy Limits:** Verify that every analogy has an honest, explicit `analogy_limits` explanation.
- [ ] **No Banned Phrases:** Search for "all of the above" and "none of the above" — none permitted.
- [ ] **Explanations for Wrong Options:** Ensure every option ID not in `correct_option_ids` has an entry in `explanation_wrong`.
- [ ] **Swahili Quality:** Verify technical terms are in English and `"_review": "Needs native-speaker review"` is present at the file root.
- [ ] **Run Validator:** Execute:
  ```bash
  npm run validate:content
  ```
  The script will catch schema violations, word count overflows, missing topic coverage, or broken option IDs.
