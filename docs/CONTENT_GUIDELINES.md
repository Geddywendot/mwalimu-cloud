# Content guidelines

1. **Original only.** No real exam questions, no "brain dumps". Base content on the public Microsoft Learn skills outline.
2. **Unofficial.** Keep the footer on every page. No Microsoft or Azure logos.
3. **Definition first.** Every analogy sits beside an accurate definition and a "where it breaks down" note.
4. **Analogy quality.** Use widely understood, respectful scenarios (transport, mobile money, markets, utilities, housing). No stereotypes. Prefer analogies that map one-to-one to the concept.
5. **Plain language.** About grade 8. Short sentences. Explain every term.
6. **Review flagged questions** (`questions.flagged = true`) weekly, then fix or delete.

## Add a language
1. Add `{code, label}` to `LANGUAGES` in `src/lib/settings.ts`.
2. Copy `src/i18n/en.json` to `<code>.json` and translate; register it in `src/hooks/useSettings.ts`.
3. Add the name to `LANGUAGE_NAMES` in `supabase/functions/_shared/prompts/common.ts`.
4. Have a native speaker review technical wording.

## Add a certification
Create a new topic file (e.g. `ai900.ts`), seed the `topics` table, and parameterise the prompt's exam name. The engine is otherwise unchanged.
