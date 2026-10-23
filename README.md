# Mwalimu Cloud (unofficial AZ-900 study buddy)

> **Unofficial study tool. Not affiliated with or endorsed by Microsoft.** No Microsoft logos are used. All questions are original and AI-generated from the public AZ-900 skills outline.

Mwalimu Cloud explains Azure concepts in plain language with African analogies (matatus, M-Pesa agents, prepaid tokens, SACCOs), generates original practice questions with instant feedback, tracks readiness per domain, and brings back missed questions with simple spaced repetition.

Built for the 1 Million Devs "Vibe Coding Hackathon: AZ-900 Exam Prep Edition".

## Features
- **Explain mode:** simple explanation, official-style definition, African analogy, where the analogy breaks down, key terms, exam tip, common mistake. English or Kiswahili. Cached in the database. Topic-limited follow-up chat (5 per session).
- **Quiz mode:** single, multiple choice and true/false. Feedback explains the right answer and why each wrong option is wrong. Questions are validated, stored in a bank, and reused if the AI is down.
- **Smart revision:** Leitner system, 5 boxes (0, 1, 3, 7, 14 days).
- **Readiness dashboard:** domain scores, weighted overall score, trend line, 5 weakest topics, exam countdown with a daily target.
- **Guest mode** and magic-link sign-in.

## Tech stack
React + TypeScript + Vite, Tailwind, React Router, TanStack Query, Recharts, Zod, Vitest. Supabase (Postgres, Auth, RLS, Edge Functions). Claude API (server-side only).

## Run it locally (about 10 minutes)
1. `npm install`
2. Create a Supabase project. In the SQL editor run `supabase/migrations/001_init.sql`, then `supabase/seed.sql`.
3. `cp .env.example .env` and fill `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` (Project settings > API).
4. Install the [Supabase CLI](https://supabase.com/docs/guides/cli), then:
   ```
   supabase login
   supabase link --project-ref YOUR_REF
   supabase secrets set ANTHROPIC_API_KEY=sk-ant-... ANTHROPIC_MODEL=claude-sonnet-5-5
   supabase functions deploy explain generate-quiz followup
   ```
5. In Supabase Auth settings, add `http://localhost:5173` to the redirect URLs.
6. `npm run dev` and open http://localhost:5173
7. `npm test` runs the spaced repetition and readiness tests.

## Deploy
Frontend: connect the repo to Vercel or Netlify, set the two `VITE_` variables, build command `npm run build`, output `dist`. Add the deployed URL to Supabase Auth redirect URLs.

## Project structure
```
docs/        architecture, prompts, database, content rules, roadmap, demo script
supabase/    migrations, seed, Edge Functions (explain, generate-quiz, followup) + shared prompts
src/         routes, components, lib (pure logic), hooks, data/topics.ts, i18n
tests/       Vitest tests
```

## How AI is used
Claude is called only from Edge Functions. Every reply is JSON-validated with Zod, retried once on failure, quality-checked, and logged (no personal data). See `docs/PROMPTS.md`.

## Assumptions and limitations
- The topic list in `src/data/topics.ts` is a best effort. **Verify it against the current Microsoft Learn skills outline.**
- Progress is stored in localStorage and written through to Supabase when signed in. The dashboard reads local data, so it does not yet sync across devices (see roadmap).
- The Kiswahili UI text and AI output should be reviewed by a native speaker.
- Rate limit is 30 AI calls per hour per user (or per IP for guests).
- The "readiness" score is an estimate, not a guarantee.
- Guests share the anon key; the rate limit by IP is the abuse control.

## Credits
Built with Claude, Supabase and the 1 Million Devs community.
